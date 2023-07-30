import { SortOrder } from "mongoose";

export const parseQuerySort = (sort: string): {[key: string]: SortOrder} => {
    let sortObj: {[key: string]: SortOrder} = {};
    const sorts = sort.split(',');
    sorts.forEach( e => {
        const sortData = e.split('-');
        const isASC = sortData.length !== 1 ? false : true;
        sortObj[(isASC) ? sortData[0] : sortData[1]] = (isASC) ? 1 : -1;
    });
    return sortObj;
}