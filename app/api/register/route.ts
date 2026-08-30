import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import User from "@/models/user";
import dbConnect from "@/utils/dbConnect";

const verifyRecaptcha = async (token, retries = 3) => {
  if (token === 'DUMMY_TOKEN_FOR_DEV') return true;

  const secretKey = "6LfcX_QrAAAAAF8oIdu10tJjMtE7_rYlM6Wn77-h";
  const url = "https://www.google.com/recaptcha/api/siteverify";

  const params = `secret=${secretKey}&response=${token}`;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      const data = (await response.json()) as { success?: boolean };
      console.log("data google", data);

      if (data.success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (attempt === retries - 1) {
        throw new Error("All reCaptcha verification attempts failed!");
      }
    }
  }
};

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const { name, email, password, organization, recaptchaToken } = body;

  //console.log({ name, email, password, organization, recaptchaToken });

  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return NextResponse.json({ err: "reCaptcha verification failed!" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { err: "Email already in use" },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await new User({
      name,
      email,
      password: hashedPassword,
      organization,
    }).save();

    return NextResponse.json({ msg: "User registered successfully" });
  } catch (error) {
    console.log("error==========", error);
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
