import React from "react";
import Link from "next/link";
import LoginForm from "../forms/login-form";
import LoginShapes from "./login-shapes";

const LoginArea = () => {
  return (
    <>
      <section className="tp-login-area pb-140 p-relative z-index-1 fix">
        <LoginShapes />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="tp-login-wrapper">
                <div className="tp-login-top text-center mb-30">
                  <h3 className="tp-login-title">Đăng nhập vào CH-Store.</h3>
                  <p>
                    Bạn chưa có tài khoản?{" "}
                    <span>
                      <Link href="/register">Tạo tài khoản ngay</Link>
                    </span>
                  </p>
                </div>
                <div className="tp-login-option">
                  <LoginForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginArea;
