"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      <div
        onClick={() => router.push("/dashboard/user/profile")}
        style={{
          position: "absolute",
          top: "50px",
          right: "20px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "70px",
            height: "70px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: `comic-gradient(#f09433,#e6683c,#dc2743,#cc2366,#bc1888,#f00943)`,
              animation: "rotateBorder 2s linear infinite",
              zIndex: 1,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "66px",
                borderRadius: "80%",
                backgroundColor: "white",
              }}
            >
              <img
                src={session?.user?.image || "/images/logo2.png"}
                alt="Admin Avatar"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  position: "relative",
                  zIndex: "2",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
