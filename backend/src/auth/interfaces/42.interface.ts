export interface FortyTwoProfile {
  username: string;
  displayName: string;
  image: { link: { value: string } };
  emails: { value: string }[];
  _json: {
    image: {
      link: string;
    };
  };
}
