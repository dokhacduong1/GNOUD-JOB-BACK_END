"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.edit = exports.createRecord = exports.editStatus = void 0;
const filterQueryStatus_1 = require("../../../../helpers/filterQueryStatus.");
const editStatus = (req, res, next) => {
    const status = req.body.status;
    if (!status) {
        res.status(400).json({ error: "Chưa Có Dữ Liệu!", code: 400 });
        return;
    }
    if (!(0, filterQueryStatus_1.filterQueryStatusJobsCategories)(status)) {
        res.status(400).json({ error: "Dữ Liệu  Trạng Thái Không Hợp Lệ!", code: 400 });
        return;
    }
    next();
};
exports.editStatus = editStatus;
const createRecord = (req, res, next) => {
    const title = req.body.title || "";
    const status = req.body.status || "";
    if (!title) {
        res.status(400).json({ error: "Chưa Có Tiêu Đề Dữ Liệu!", code: 400 });
        return;
    }
    if (status) {
        if (!(0, filterQueryStatus_1.filterQueryStatusJobsCategories)(status)) {
            res.status(400).json({ error: "Dữ Liệu Trạng Thái Không Hợp Lệ!", code: 400 });
            return;
        }
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
