import { Notifications } from "@/components/notification";
import 'react-toastify/dist/ReactToastify.css';



export default function Notification() {


  

  return (
    <div className="relative flex items-start justify-start w-full h-full sm:ml-[calc(100vw-467px)] ml-[calc(100vw-203px)]">
      <Notifications />
      {/* <ToastContainer /> */}

    </div>
  );
}
