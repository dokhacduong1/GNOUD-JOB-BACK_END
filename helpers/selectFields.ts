export function selectFields(data: any[], fields: string[]): any[] {
    if (!data || !fields) return [];
    return data.map(item => fields.reduce((acc, field) => {
      if (item.hasOwnProperty(field)) {
        acc[field] = item[field];
      }
      return acc;
    }, {}));
  }