import { useState, useEffect } from "react";

export function useGetCurrentDate() {

  const CurrentDate = () => {
    const [date,setDate] = useState(new Date())
    useEffect(() => {
      const timer = setInterval(() => {
        setDate(new Date());
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    },[]);
    return ( date.toDateString() )
  }
  return { CurrentDate }
}