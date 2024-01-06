"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.edit = exports.create = exports.editStatus = void 0;
const filterQueryStatus_1 = require("../../../../helpers/filterQueryStatus.");
const editStatus = (req, res, next) => {
    const status = req.body.status.toString();
    if (!status) {
        res.status(400).json({ error: "Chưa Có Dữ Liệu!" });
        return;
    }
    if (!(0, filterQueryStatus_1.filterQueryStatus)(status)) {
        res.status(400).json({ error: "Dữ Liệu Không Hợp Lệ!" });
        return;
    }
    next();
};
exports.editStatus = editStatus;
const create = (req, res, next) => {
    const title = req.body.title.toString();
    const status = req.body.status.toString();
    const content = req.body.content.toString();
    const timeStart = req.body.timeStart.toString();
    const timeFinish = req.body.timeFinish.toString();
    if (!title) {
        res.status(400).json({ error: "Tiêu Đề Chưa Có Dữ Liệu!" });
        return;
    }
    if (!status) {
        res.status(400).json({ error: "Trạng Thái Chưa Có Dữ Liệu!" });
        return;
    }
    if (!content) {
        res.status(400).json({ error: "Nội Dung Chưa Có Dữ Liệu!" });
        return;
    }
    if (!timeStart) {
        res.status(400).json({ error: "Thời Gian Bắt Đầu Chưa Có Dữ Liệu!" });
        return;
    }
    if (!timeFinish) {
        res.status(400).json({ error: "Thời Gian Hoàn Thành Chưa Có Dữ Liệu!" });
        return;
    }
    next();
};
exports.create = create;
const edit = (req, res, next) => {
    const title = req.body.title.toString();
    if (title === "") {
        res.status(400).json({ error: "Tiêu Đề Chưa Có Dữ Liệu!" });
        return;
    }
    next();
};
exports.edit = edit;
