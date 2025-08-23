import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Admin } from "../models/admin.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const existedAdmin = await Admin.findOne({ email });
    if (existedAdmin) {
        throw new ApiError(409, "Admin with this email already exists");
    }

    const admin = await Admin.create({ email, password });
    const createdAdmin = await Admin.findById(admin._id).select("-password");

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering the admin");
    }

    return res.status(201).json(
        new ApiResponse(201, createdAdmin, "Admin registered successfully")
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
        throw new ApiError(404, "Admin does not exist");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials");
    }

    const accessToken = admin.generateAccessToken();
    const loggedInAdmin = await Admin.findById(admin._id).select("-password");

    const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production' };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                { admin: loggedInAdmin, accessToken },
                "Admin logged in successfully"
            )
        );
});

const logoutAdmin = asyncHandler(async (req, res) => {
    const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production' };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "Admin logged out successfully"));
});

export { registerAdmin, loginAdmin, logoutAdmin };