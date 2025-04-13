import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: function() {
        return !this.googleId; // Nếu không phải login bằng Google thì bắt buộc
      }
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true // Cho phép null và unique chỉ áp dụng cho non-null values
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

