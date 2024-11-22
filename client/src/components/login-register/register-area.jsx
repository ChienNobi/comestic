import React from "react";
import Link from "next/link";
import LoginShapes from "./login-shapes";
import RegisterForm from "../forms/register-form";

const RegisterArea = () => {
  return (
    <>
      <section className="tp-login-area pb-140 p-relative z-index-1 fix">
        <LoginShapes />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="tp-login-wrapper">
                <div className="tp-login-top text-center mb-30">
                  <h3 className="tp-login-title">Đăng Ký CH-Store.</h3>
                  <p>
                    Bạn đã có tài khoản?{" "}
                    <span>
                      <Link href="/login">Đăng nhập ngay</Link>
                    </span>
                  </p>
                </div>
                <div className="tp-login-option">
                  <RegisterForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterArea;
