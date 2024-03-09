import knex from "./knex"
import { MYSQL_MOMENT_DATETIME_FORMAT, MYSQL_MOMENT_DATE_FORMAT } from "./constant"

import moment from 'moment'

export function getDateTimeOrNull(item) {

    try {

        if (item && moment(item).isValid()) {
            return moment(item).format(MYSQL_MOMENT_DATETIME_FORMAT)
        }

        return null
    } catch (err) {
        return null
    }

}

export function getDateOrNull(item) {

    try {

        if (item && moment(item).isValid()) {
            return moment(item).format(MYSQL_MOMENT_DATE_FORMAT)
        }

        return null
    } catch (err) {
        return null
    }

}

export function getStringOrNull(item) {

    try {

        if (item) {
            return item.toString()
        }

        return null

    } catch (error) {
        return null
    }
}

export function getOneOrZero(item) {
    return item ? '1' : '0'
}

export function getObjOrNull(obj) {
    return obj ? obj : null
}

export function getObjOrUndefined(value) {
    try {
        if (!value) {
            return undefined
        }
        return value
    } catch (err) {
        return undefined
    }
}

export function getIntOrNull(val) {
    try {
        if (!isNaN(val) && parseInt(val) >= 0) {
            return parseInt(val)
        }
        return null
    } catch (err) {
        return null
    }
}

export function getNumberOrZero(val) {
    try {
        if (val && !isNaN(val)) {
            return Number(val)
        }
        return 0
    } catch (err) {
        return 0
    }
}

export function getNumberOrOne(val) {
    try {
        if (val && !isNaN(val)) {
            return Number(val)
        }
        return 1
    } catch (err) {
        return 1
    }
}

export function getDoubleOrNull(val) {
    try {
        if (!isNaN(val) && parseInt(val) >= 0) {
            return Number(val).toFixed(2)
        }
        return null

    } catch (err) {
        return null
    }
}

export function getDoubleOrZero(val) {
    try {
        if (val && !isNaN(val)) {
            return Number(val).toFixed(2)
        }
        return 0
    } catch (err) {
        return 0
    }
}

export function getIntOrZero(val) {
    try {
        if (!isNaN(val) && parseInt(val) >= 0) {
            return parseInt(val)
        }
        return 0
    } catch (err) {
        return 0
    }
}

export function getIntOrUndefined(val) {

    try {

        if (!isNaN(val) && Number.isInteger(val) && val >= 0) {
            return parseInt(val)
        }
        return undefined
    } catch (err) {
        return undefined
    }
}

export function getTrueOrFalse(value) {
    if (!value) {
        return false
    }
    return true
}

export function removeRepetitions(array) {
    let new_arr = []
    for (let i = 0; i < array.length; i++) {
        const item = array[i]
        if (!new_arr.includes(item)) {
            new_arr.push(item)
        }
    }
    return new_arr
}

export function knexPagination(perPage, currentPage) {
    let paginate = {
        perPage: null,
        currentPage: null,
    }
    paginate.currentPage = (currentPage && !isNaN(currentPage)) ? parseInt(currentPage) : 1
    paginate.perPage = (perPage && !isNaN(perPage)) ? parseInt(perPage, null) : 15
    return paginate
}

export const validateEmail = (email) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true)
    }
    return (false)
}

export async function checkExists(
    table_name,
    id_name,
    id,
    compare_column,
    compare_str,
    paramFirstString
) {

    const [checkExists] = await knex(table_name)
        .where((builder) => {
            builder.where(compare_column, compare_str)
            if (id && !isNaN(id)) builder.whereNot(id_name, id)
        })

    if (checkExists) {
        return { exists: true, message: `${paramFirstString} ${compare_str} Already Exists` }
    }

    return { exists: false }

}
