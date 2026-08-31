const asyncHandler = require("../../utils/asyncHandler");
const {
    getAllMenusServices,
    getOneMenuService,
    addMenuService,
    updateMenuService,
    deleteMenuService,
    disableMenuService,
    enableMenuService
} = require("./menu.service");

const getAllMenusController = asyncHandler(async (req, res) => {
    await getAllMenusServices(req, res)
})
const getOneMenuController = asyncHandler(async (req, res) => {
    await getOneMenuService(req, res)
})
const addMenuController = asyncHandler(async (req, res) => {
    await addMenuService(req, res)
})
const updateMenuController = asyncHandler(async (req, res) => {
    await updateMenuService(req, res)
})
const deleteMenuController = asyncHandler(async (req, res) => {
    await deleteMenuService(req, res)
})
const disableMenuController = asyncHandler(async (req, res) => {
    await disableMenuService(req, res)
})
const enableMenuController = asyncHandler(async (req, res) => {
    await enableMenuService(req, res)
})

module.exports = { getAllMenusController, getOneMenuController, addMenuController, updateMenuController, deleteMenuController, disableMenuController, enableMenuController }