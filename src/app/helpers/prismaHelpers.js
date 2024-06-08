import { getIntOrNull, getStringOrNull } from "../../@core/helpers/commonHelpers";

export function whereIfValue(options, col_name, value, filterFunction) {
  value = filterFunction(value);

  if (value !== undefined && value !== null) {
    if (!options.where) {
      options.where = {};
    }

    options.where[col_name] = value;
  }
}

// export function whereOrIfValue(options, col_name, values, filterFunction) {
//   let allValues = values.map((v) => filterFunction(v));

//   if (!options.where) {
//     options.where = {};
//   }

//   if (!options.where.OR) {
//     options.where.OR = [];
//   }

//   for (let value of allValues) {
//     if (value !== undefined && value !== null) continue;

//     options.where.OR = [
//       ...options.where.OR,
//       {
//         [col_name]: value,
//       },
//     ];
//   }
// }

export function whereSomeIfValue(options, relation_name, col_name, value, filterFunction) {
  value = filterFunction(value);
  if (value !== undefined && value !== null) {
    if (!options.where) {
      options.where = {};
    }

    options.where[relation_name] = { some: {} };
    options.where[relation_name].some[col_name] = value;
  }
}

export function whereIfFlag(options, col_name, flag_value) {
  if (typeof flag_value === "number") {
    flag_value = flag_value.toString();
  }

  if (flag_value === "1" || flag_value === "0") {
    if (!options.where) {
      options.where = {};
    }

    options.where[col_name] = flag_value === "1" ? true : false;
  }
}

export function whereIfFlags(options, prefix, flags) {
  whereIfFlag(options, `${prefix}_status`, flags.status);
  whereIfFlag(options, `${prefix}_archive`, flags.archived);
  whereIfFlag(options, `${prefix}_delete`, flags.deleted);
}

export function applyIfLimit(options, limit) {
  limit = getIntOrNull(limit);
  if (limit) {
    options.take = limit;
  }
}

export function applyIfOffset(options, offset) {
  offset = getIntOrNull(offset);
  if (offset) {
    options.skip = offset;
  }
}

export function likeIfValue(options, cols, search) {
  search = getStringOrNull(search);

  if (search) {
    const OR = [];

    for (const col of cols) {
      if (col && Array.isArray(col)) {
        const obj = {};
        const searchArr = search.split(" ");
        for (let i = 0; i < col.length; i++) {
          const inner_col = col[i];
          obj[inner_col] = { contains: searchArr[i] };
        }
        OR.push(obj);
      } else {
        const obj = {};
        obj[col] = { contains: search };
        OR.push(obj);
      }
    }

    if (!options.where) {
      options.where = {};
    }

    options.where.OR = OR;

    // OR: [
    //     {
    //         t_first_name: {
    //             contains: search
    //         },
    //         t_last_name: {
    //             contains: search
    //         },
    //     },
    //     {
    //         t_mobile: {
    //             contains: search
    //         }
    //     },
    //     {
    //         t_email: {
    //             contains: search
    //         }
    //     }
    // ]
  }
}

export function nestedLikeIfValue(options, cols, search) {
  search = getStringOrNull(search);

  if (search) {
    let nestedWhere = [];

    for (let col of cols) {
      let relation = col.relation;
      let attribute = col.attribute;

      let obj = {
        [relation]: {
          [attribute]: {
            contains: search,
          },
        },
      };

      nestedWhere.push(obj);
    }

    if (!options.where) {
      options.where = {};
    }

    if (!options.where.OR) {
      options.where.OR = [];
    }

    options.where.OR = [...options.where.OR, ...nestedWhere];
  }
}
