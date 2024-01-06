"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.treeLoadSubCategory = exports.tree2 = exports.tree = void 0;
const jobCategories_model_1 = __importDefault(require("../models/jobCategories.model"));
const tree = (arr) => {
    const treeMap = {};
    const tree = [];
    arr.forEach((item, index) => {
        treeMap[item.id] = item;
        treeMap[item.id]["children"] = [];
    });
    arr.forEach((item) => {
        const newItem = item;
        const parent = treeMap[newItem.parent_id];
        if (parent) {
            parent["children"].push(treeMap[newItem.id]);
        }
        else {
            tree.push(treeMap[newItem.id]);
        }
    });
    return tree;
};
exports.tree = tree;
const tree2 = (arr) => {
    const treeMap = {};
    const tree = [];
    arr.forEach((item, index) => {
        treeMap[item.id] = Object.assign(Object.assign({}, item), { children: [] });
    });
    arr.forEach((item) => {
        const newItem = item;
        const parent = treeMap[newItem.parent_id];
        if (parent) {
            parent.children.push(treeMap[newItem.id]);
        }
        else {
            tree.push(treeMap[newItem.id]);
        }
    });
    return tree;
};
exports.tree2 = tree2;
const treeLoadSubCategory = (parentId) => __awaiter(void 0, void 0, void 0, function* () {
    const stack = [parentId];
    const allSub = [];
    while (stack.length > 0) {
        const currentId = stack.pop();
        const subs = yield jobCategories_model_1.default.find({
            parent_id: currentId,
            status: "active",
            deleted: false,
        });
        allSub.push(...subs);
        stack.push(...subs.map(sub => sub.id));
    }
    return allSub;
});
exports.treeLoadSubCategory = treeLoadSubCategory;
