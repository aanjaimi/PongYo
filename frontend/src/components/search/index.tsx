import React, { useEffect, useState } from 'react';
import { fetcher } from '@/utils/fetcher';
import type { User } from '@/types/user';
import { useInfiniteQuery } from '@tanstack/react-query';
import { type ApiResponse } from '@/types/common';
import { useRouter } from 'next/router';
import { Input } from '../ui/input';
import Loading from '@/pages/Loading';
import { Card, CardContent } from '../ui/card';
import { EmptyView } from '../empty';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const getUsers = async (page: number, login: string) => {
  if (!login.length) return { data: [] as User[], limit: 1 };
  return (
    await fetcher<ApiResponse<User[]>>(`/users`, {
      params: { page, login, limit: 3 },
    })
  ).data;
};

function Search() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [view, setView] = useState(false);
  const searchQuery = useInfiniteQuery(
    ['search'],
    ({ pageParam = 0 }) => getUsers(pageParam as number, query.trim()),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.data.length < lastPage.limit) return null;
        return pages.length;
      },
      retry: false,
      keepPreviousData: false
    },
  );

  useEffect(() => {
    setView(query.trim().length > 0);
    if (query.trim().length) {
      setTimeout(() => {
        void searchQuery.refetch();
      }, 5);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  if (searchQuery.isLoading) return <Loading />;
  if (searchQuery.isError) return void router.push('/404');
  const pages = searchQuery.data?.pages;
  return (
    <div className="relative w-[400px]">
      <Input
        className="w-full"
        type="search"
        placeholder="Search..."
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      <Card
        className={cn('absolute mt-2 w-full', {
          hidden: !view,
        })}
      >
        <CardContent className="grid h-[40%] gap-2 overflow-hidden p-2">
          {!pages[0]?.data.length && (
            <EmptyView
              title="No Search Results"
              message="Try searching for something else."
            ></EmptyView>
          )}
          {pages.map((page, idx) => (
            <React.Fragment key={idx}>
              {page.data.map((user) => (
                <div
                  key={user.login}
                  className="flex items-center justify-between space-x-4"
                >
                  <Link
                    href={`/profile/${user.login}`}
                    onClick={() => {
                      setQuery('');
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          className="rounded-full"
                          src={user.avatar.path}
                          role="img"
                          width={50}
                          height={50}
                        />
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {user.displayname}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.login}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </React.Fragment>
          ))}

          {searchQuery.hasNextPage && (
            <Button
              onClick={() => void searchQuery.fetchNextPage()}
              disabled={searchQuery.isFetchingNextPage}
            >
              {searchQuery.isFetchingNextPage ? 'Loading...' : 'Load More'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Search;
