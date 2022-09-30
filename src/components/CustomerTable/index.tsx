import { useEffect, useMemo, useState } from "react";
import Select from 'react-select';
import styled from 'styled-components';

import { useFetchTableData } from "../../api/useFetch";
import { IOptionType } from "../../types/OptionType";
import { ITableData } from "../../types/TableTypes";
import Pagination from "./Pagination";

const options: IOptionType[] = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
]

const keys = ['Email', 'Name', 'Joined On', 'Last Login', 'Transactions / Balance', 'Status', 'Bio'];

function getValue(user: ITableData, sortType: string): string {
    const data = [user.email, user.name, user.joinedAt, user.lastLogin, '', user.status, user.bio];
    let idx = keys.indexOf(sortType);
    // console.log(keys, idx, sortType)
    return data[idx];
}

export default function CustomerTable() {
    const data = useFetchTableData('./data.json');
    const [sort, setSort] = useState<string>('Email');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [PageSize, setPageSize] = useState<number>(5);

    const tableData = useMemo(() => {
        return data.sort((user1: ITableData, user2: ITableData) => {
            if (sort === 'JoinedAt' || sort === 'lastLogin') {
                return new Date(getValue(user1, sort)).getTime() - new Date(getValue(user2, sort)).getTime();
            }
            return getValue(user1, sort).localeCompare(getValue(user2, sort));
        });
    }, [data, sort]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return tableData.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, tableData, PageSize, sort, data]);

    const onPageSize = (option: any) => {
        setCurrentPage(1);
        setPageSize(option.value);
    }

    return <>
        <table>
            <thead>
                <tr>
                    {keys.map((keyValue, idx) => (
                        <th
                            className={idx === 0 ? "table-header shadow" : 'table-header'}
                            key={idx}
                            onClick={() => setSort(keyValue)}
                        >
                            {keyValue}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {currentTableData.map((user, i) => {
                    return <tr key={i}>
                        <td>
                            <div className="first-table">
                                <img src={user.avatar} alt="user avatar" />
                                <div className="user-info">
                                    <div className="username">{user.userName}</div>
                                    <div className="email">{user.email}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            {user.name}
                        </td>
                        <td>
                            {new Date(user.joinedAt).toLocaleDateString("en-US")}
                        </td>
                        <td>
                            {new Date(user.lastLogin).toLocaleString('en-US', { hour12: false })}
                        </td>
                        <td>
                            <div className="transaction">-$200,00</div>
                            <div className="balance">$500,00</div>
                        </td>
                        <td>
                            <div className="active">
                                {user.status}
                                <div className="circle"></div>
                            </div>
                        </td>
                        <td>
                            {user.bio}
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
        <div className="table-footer">
            <Select
                options={options}
                onChange={onPageSize}
                defaultValue={options[0]}
            />
            <Pagination
                currentPage={currentPage}
                className="pagination-bar"
                totalCount={data.length}
                pageSize={PageSize}
                siblingCount={1}
                onPageChange={page => setCurrentPage(page)}
            />
        </div>
    </>

}