import { useEffect, useState } from "react";
import { ITableData } from "../types/TableTypes";

export const useFetchTableData = (url: string) :ITableData[] => {
    const [data, setData] = useState<ITableData[]>([]);
    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then((data:ITableData[]) => setData(data))
            .catch(err => console.log(err))
    }, [url]);

    return data;
}