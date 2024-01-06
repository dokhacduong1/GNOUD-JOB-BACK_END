"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPermissions = exports.edit = exports.createRecord = void 0;
const permissionsCheck = [
    "job-categories-create",
    "job-categories-edit",
    "job-categories-delete",
    "job-categories-view",
    "roles-edit",
    "roles-delete",
    "roles-create",
    "roles-view"
];
const createRecord = (req, res, next) => {
    const title = req.body.title || "";
    if (!title) {
        res.status(400).json({ error: "Chưa Có Tiêu Đề Dữ Liệu!", code: 400 });
        return;
    }
    next();
};
exports.createRecord = createRecord;
const edit = (req, res, next) => {
    const title = req.body.title.toString();
    if (title === "") {
        res.status(400).json({ error: "Tiêu Đề Chưa Có Dữ Liệu!" });
        return;
    }
    next();
};
exports.edit = edit;
const editPermissions = (req, res, next) => {
    const permissions = req.body.permissions;
    if (permissions.length > 0) {
        const invalidPermissions = permissions.every(dataCheck => permissionsCheck.includes(dataCheck));
        if (!invalidPermissions) {
            res.status(400).json({ error: "Quyền Không Hợp Lệ!" });
            return;
        }
    }
    const dataFilter = permissionsCheck.filter(dataCheck => permissions.includes(dataCheck));
    req["role_permissions"] = dataFilter;
    next();
};
exports.editPermissions = editPermissions;
