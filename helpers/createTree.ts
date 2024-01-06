import JobCategories from "../models/jobCategories.model";

export const tree = (arr) => {
    const treeMap = {}; // Sử dụng một bản đồ để theo dõi các nút bằng id
    const tree = []; // Mảng chứa cây kết quả

    // Tạo một mục nhập trong bản đồ cho mỗi nút và sắp xếp lại arr theo id
    arr.forEach((item, index) => {
        treeMap[item.id] = item
        treeMap[item.id]["children"] = []
    });
  
    // Duyệt qua lại arr để xây dựng cây và cập nhật mảng tree
    arr.forEach((item) => {
        const newItem = item;
        const parent = treeMap[newItem.parent_id];
        if (parent) {
            //Parent hiện tại đang tham chiếu đến object lên có thể tùy chỉnh objeect được
            //Ta push cái id của item hiện tại vào cái Prent chính
            //Yên tâm là vì đang tham chiếu cái thằng tree.push dưới nó vẫn tham chiếu đến được
            parent["children"].push(treeMap[newItem.id]);
          
        } else {
            tree.push(treeMap[newItem.id]); // Nếu không có nút cha, thì đây là nút gốc
        }

    });

    return tree;
}

export const tree2 = (arr) => {
    const treeMap = {}; // Sử dụng một bản đồ để theo dõi các nút bằng id
    const tree = []; // Mảng chứa cây kết quả

    // Tạo một mục nhập trong bản đồ cho mỗi nút và sắp xếp lại arr theo id
    arr.forEach((item, index) => {
        treeMap[item.id] = { ...item, children: [] };
    });
  
    // Duyệt qua lại arr để xây dựng cây và cập nhật mảng tree
    arr.forEach((item) => {
        const newItem = item;
        const parent = treeMap[newItem.parent_id];
        if (parent) {
            //Parent hiện tại đang tham chiếu đến object lên có thể tùy chỉnh objeect được
            //Ta push cái id của item hiện tại vào cái Prent chính
            //Yên tâm là vì đang tham chiếu cái thằng tree.push dưới nó vẫn tham chiếu đến được
            parent.children.push(treeMap[newItem.id]);
        } else {
            tree.push(treeMap[newItem.id]); // Nếu không có nút cha, thì đây là nút gốc
        }
    });

    return tree;
}
export const treeLoadSubCategory =async (parentId) => {
    const stack = [parentId];
    const allSub = [];
  
    while (stack.length > 0) {
      const currentId = stack.pop();
  
      const subs = await JobCategories.find({
        parent_id: currentId,
        status: "active",
        deleted: false,
      });
  
      allSub.push(...subs);
     
      // Push the child IDs onto the stack
      stack.push(...subs.map(sub => sub.id));
    }
  
    return allSub;
}
