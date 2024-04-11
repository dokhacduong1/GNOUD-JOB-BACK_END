"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailEmployerRefureCv = exports.sendMailEmployerAcceptCv = exports.sendMailEmployer = exports.sendMail = void 0;
const nodemailer = require("nodemailer");
const LINK = "http://34.87.54.148:3001";
const sendMail = (email, subject, tokenReset) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Page Title</title>

    <!-- Nhúng CSS của Bootstrap -->
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
    />

    <style>
      /* Tùy chỉnh các kiểu CSS của bạn tại đây */

      /* CSS cho .background và .logo */
      .background {
        background: #eee;
        padding: 20px;
      }

      .logo {
        padding: 0 30px 30px 30px;

        text-align: center;
      }
      .logo h1 {
        display: flex;
        justify-content: center;
        align-items: center;
        display: inline-block;
        font-size: 30px;
        font-weight: 700;
        text-decoration: none;
        color: #5dcaf9;
        margin-bottom: 0;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-radius: 10px;
        background-color: #f6f6f6;
      }

      .content .box-content {
        padding: 30px;
        border-radius: 5px;
        background: #fff;
        display: inline-block;
      }
      .content .box-content a {
        color: rgb(37, 166, 221);
        text-decoration: underline;
      }
      .icon {
        margin-top: 20px;
      }
      .link {
        margin-bottom: 20px;
      }
      .link a {
        color: #888;
        display: inline-block;
        margin: 0px 10px;
        text-decoration: underline;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="background">
      <div class="logo">
        <h1>GNOUD</h1>
      </div>
      <div
        class="content" 
        style="text-align: center;"
      >
        <div style="text-align: left;max-width: 600px;" class="box-content">
          <h3>Bạn vừa gửi yêu cầu cập nhật lại mật khẩu?</h3>
          <p>
            Click vào link sau để reset lại mật khẩu:
            <a href="${LINK}/reset-password/${tokenReset}"
              >${LINK}/reset-password/${tokenReset}</a
            >
          </p>
          <p>
            Nếu không phải bạn đã gửi yêu cầu reset mật khẩu, xin hãy bỏ qua
            email này. Nếu có bất kì thắc mắc nào, vui lòng liên hệ
            <a href="">hotro@duongit.vn</a> để nhận được hỗ trợ.
          </p>
          <p>Cảm ơn bạn đã sử dụng dịch vụ.</p>
          <p>GNOUD</p>
          <p
            style="
              text-align: center;
              font-style: italic;
              font-size: 11px;
              color: #888;
            "
          >
            -- Đây là email tự động. Xin bạn vui lòng không gửi phản hồi vào hộp
            thư này --
          </p>
        </div>
      </div>
      <div
       
        class="icon"
      >
        <p style="text-align: center">
          <a href="#!" style="margin: 0px 5px"
            ><img
              src="https://ci3.googleusercontent.com/meips/ADKq_NbW9YGQtanfRmUJds-lyoUscd-GvLPhgIHsezOZYz0avAEFYKiZng9VYqM4njKrNPWYgopZhCsKzeMcQSk0IW9TAdSJ2z0hQjuf9VLV=s0-d-e1-ft#http://www.topcv.vn/images/emails/color-facebook-48.png"
              height="24"
              width="24"
              class="CToWUd"
              data-bit="iit"
              jslog="32272; 1:WyIjdGhyZWFkLWY6MTc4OTI0ODczOTkwMjc3MTAzNiJd; 4:WyIjbXNnLWY6MTc4OTI0ODczOTkwMjc3MTAzNiJd"
          /></a>
          <a href="#!" style="margin: 0px 5px"
            ><img
              src="https://ci3.googleusercontent.com/meips/ADKq_NbKllyHrY-x6VjdMcFyQZ2m_PbGr_KC2Sw87sjQUUgopv2f7GE1UaaSIkooBdr_Hs9nS0raubg-yDu4SJcly0ncbAq514Iid3oVpv8u=s0-d-e1-ft#https://www.topcv.vn/images/emails/color-twitter-48.png"
              height="24"
              width="24"
              class="CToWUd"
              data-bit="iit"
          /></a>
          <a href="#!" style="margin: 0px 5px"
            ><img
              src="https://ci3.googleusercontent.com/meips/ADKq_NaU7_R8FjG2UwxvrWZSUUU73IRG2iFs8_qBNilTrT3JG-8Ph15h1m_VTMlwf75dgNCTeHCEKgiW_tJh7r_-Fizuk1M4eo2B9o-3=s0-d-e1-ft#https://www.topcv.vn/images/emails/color-link-48.png"
              height="24"
              width="24"
              class="CToWUd"
              data-bit="iit"
          /></a>
        </p>
      </div>
      <p style="font-size: 12px; color: #888; text-align: center">
        &copy 2024 GNOUD. All rights reserved.
      </p>
      <div
        style="text-align: center;"
        class="link "
      >
        <a href="#!">Giới thiệu</a>
        <a href="#!">Hợp tác</a>
        <a href="#!">Blog</a>
      </div>
    </div>

    <!-- Nhúng JavaScript của Bootstrap (tùy chọn) -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
  </body>
</html>

  `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
};
exports.sendMail = sendMail;
const sendMailEmployer = (email, subject, tokenReset) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Page Title</title>

    <!-- Nhúng CSS của Bootstrap -->
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
    />

    <style>
      /* Tùy chỉnh các kiểu CSS của bạn tại đây */

      /* CSS cho .background và .logo */
      .background {
        background: #eee;
        padding: 20px;
      }

      .logo {
        padding: 0 30px 30px 30px;

        text-align: center;
      }
      .logo h1 {
        display: flex;
        justify-content: center;
        align-items: center;
        display: inline-block;
        font-size: 30px;
        font-weight: 700;
        text-decoration: none;
        color: #fda4c8;
        margin-bottom: 0;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        border-radius: 10px;
        background-color: #f6f6f6;
      }

      .content .box-content {
        padding: 30px;
        border-radius: 5px;
        background: #fff;
        display: inline-block;
      }
      .content .box-content a {
        color: #fda4c8;
        text-decoration: underline;
      }
      .icon {
        margin-top: 20px;
      }
      .link {
        margin-bottom: 20px;
      }
      .link a {
        color: #888;
        display: inline-block;
        margin: 0px 10px;
        text-decoration: underline;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="background">
      <div class="logo">
        <h1>GNOUD</h1>
      </div>
      <div
        class="content" 
        style="text-align: center;"
      >
        <div style="text-align: left;max-width: 600px;" class="box-content">
          <h3>Bạn vừa gửi yêu cầu cập nhật lại mật khẩu?</h3>
          <p>
            Click vào link sau để reset lại mật khẩu:
            <a href="${LINK}/nha-tuyen-dung/reset-password/${tokenReset}"
              >${LINK}/nha-tuyen-dung/reset-password/${tokenReset}</a
            >
          </p>
          <p>
            Nếu không phải bạn đã gửi yêu cầu reset mật khẩu, xin hãy bỏ qua
            email này. Nếu có bất kì thắc mắc nào, vui lòng liên hệ
            <a href="">hotro@duongit.vn</a> để nhận được hỗ trợ.
          </p>
          <p>Cảm ơn bạn đã sử dụng dịch vụ.</p>
          <p>GNOUD</p>
          <p
            style="
              text-align: center;
              font-style: italic;
              font-size: 11px;
              color: #888;
            "
          >
            -- Đây là email tự động. Xin bạn vui lòng không gửi phản hồi vào hộp
            thư này --
          </p>
        </div>
      </div>
      <div
       
        class="icon"
      >
        <p style="text-align: center">
          <a href="#!" style="margin: 0px 5px"
            ><img
              src="https://ci3.googleusercontent.com/meips/ADKq_NbW9YGQtanfRmUJds-lyoUscd-GvLPhgIHsezOZYz0avAEFYKiZng9VYqM4njKrNPWYgopZhCsKzeMcQSk0IW9TAdSJ2z0hQjuf9VLV=s0-d-e1-ft#http://www.topcv.vn/images/emails/color-facebook-48.png"
              height="24"
              width="24"
              class="CToWUd"
              data-bit="iit"
              jslog="32272; 1:WyIjdGhyZWFkLWY6MTc4OTI0ODczOTkwMjc3MTAzNiJd; 4:WyIjbXNnLWY6MTc4OTI0ODczOTkwMjc3MTAzNiJd"
          /></a>
          <a href="#!" style="margin: 0px 5px"
            ><img
              src="https://ci3.googleusercontent.com/meips/ADKq_NbKllyHrY-x6VjdMcFyQZ2m_PbGr_KC2Sw87sjQUUgopv2f7GE1UaaSIkooBdr_Hs9nS0raubg-yDu4SJcly0ncbAq514Iid3oVpv8u=s0-d-e1-ft#https://www.topcv.vn/images/emails/color-twitter-48.png"
              height="24"
              width="24"
              class="CToWUd"
              data-bit="iit"
          /></a>
          <a href="#!" style="margin: 0px 5px"
            ><img
              src="https://ci3.googleusercontent.com/meips/ADKq_NaU7_R8FjG2UwxvrWZSUUU73IRG2iFs8_qBNilTrT3JG-8Ph15h1m_VTMlwf75dgNCTeHCEKgiW_tJh7r_-Fizuk1M4eo2B9o-3=s0-d-e1-ft#https://www.topcv.vn/images/emails/color-link-48.png"
              height="24"
              width="24"
              class="CToWUd"
              data-bit="iit"
          /></a>
        </p>
      </div>
      <p style="font-size: 12px; color: #888; text-align: center">
        &copy 2024 GNOUD. All rights reserved.
      </p>
      <div
        style="text-align: center;"
        class="link "
      >
        <a href="#!">Giới thiệu</a>
        <a href="#!">Hợp tác</a>
        <a href="#!">Blog</a>
      </div>
    </div>

    <!-- Nhúng JavaScript của Bootstrap (tùy chọn) -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
  </body>
</html>

  `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
};
exports.sendMailEmployer = sendMailEmployer;
const sendMailEmployerAcceptCv = (email, subject, record) => {
    var _a;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Page Title</title>
    
        <!-- Nhúng CSS của Bootstrap -->
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        />
      </head>
      <body style="margin: 0; padding: 0">
        <div class="background" style="background: #eee; padding: 20px">
          <div class="content" style="text-align: center">
            <div class="logo" style="padding: 0 30px 30px 30px; text-align: center">
              <h1
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  display: inline-block;
                  font-size: 30px;
                  font-weight: 700;
                  text-decoration: none;
                  color: #fda4c8;
                  margin-bottom: 0;
                  border-radius: 10px;
                  background-color: #fff;
                  padding: 0 10px;
                "
              >
                GNOUD
              </h1>
            </div>
            <div
              style="
                text-align: left;
                max-width: 600px;
                padding: 30px;
                border-radius: 5px;
                background: #fff;
                display: inline-block;
              "
              class="box-content"
            >
              <h3>Chào bạn <span style="color: #ff3f8c">${record["findName"]}</span></h3>
              <p>
                Xin chúc mừng bạn vì đã trở thành ứng viên thành công cho vị trí
                <strong style="color: #ff3f8c">${record === null || record === void 0 ? void 0 : record.title}</strong> tại
                <strong style="color: #ff3f8c"
                  >${(_a = record === null || record === void 0 ? void 0 : record.employerId) === null || _a === void 0 ? void 0 : _a.companyName}</strong
                >. Điều này thể hiện sự đánh giá cao về kỹ năng và kinh nghiệm của
                bạn trong lĩnh vực này.
              </p>
              <p>
                Chúng tôi tin rằng bạn sẽ đem lại nhiều giá trị cho đội ngũ của
                chúng tôi và góp phần vào sự phát triển của công ty. Đội ngũ nhà
                tuyển dụng sẽ liên hệ với bạn sớm nhất để bàn về các bước tiếp theo.
                Vui lòng chú ý đến email và tin nhắn từ chúng tôi để không bỏ lỡ bất
                kỳ thông tin quan trọng nào.
              </p>
              <p>
                Chân thành cảm ơn sự quan tâm và sự kiên nhẫn của bạn trong quá
                trình này. Chúng tôi rất mong chờ được làm việc cùng bạn và xin hẹn
                gặp sớm trong tương lai gần!
              </p>
              <p>Trân trọng.</p>
              <p>GNOUD</p>
              <p
                style="
                  text-align: center;
                  font-style: italic;
                  font-size: 11px;
                  color: #888;
                "
              >
                -- Đây là email tự động. Xin bạn vui lòng không gửi phản hồi vào hộp
                thư này --
              </p>
            </div>
          </div>
          <div class="icon" style="margin-top: 20px">
            <p style="text-align: center">
              <a href="#!" style="margin: 0px 5px"
                ><img
                  src="https://ci3.googleusercontent.com/meips/ADKq_NbW9YGQtanfRmUJds-lyoUscd-GvLPhgIHsezOZYz0avAEFYKiZng9VYqM4njKrNPWYgopZhCsKzeMcQSk0IW9TAdSJ2z0hQjuf9VLV=s0-d-e1-ft#http://www.topcv.vn/images/emails/color-facebook-48.png"
                  height="24"
                  width="24"
                  class="CToWUd"
                  data-bit="iit"
                  jslog="32272; 1:WyIjdGhyZWFkLWY6MTc4OTI0ODczOTkwMjc3MTAzNiJd; 4:WyIjbXNnLWY6MTc4OTI0ODczOTkwMjc3MTAzNiJd"
              /></a>
              <a href="#!" style="margin: 0px 5px"
                ><img
                  src="https://ci3.googleusercontent.com/meips/ADKq_NbKllyHrY-x6VjdMcFyQZ2m_PbGr_KC2Sw87sjQUUgopv2f7GE1UaaSIkooBdr_Hs9nS0raubg-yDu4SJcly0ncbAq514Iid3oVpv8u=s0-d-e1-ft#https://www.topcv.vn/images/emails/color-twitter-48.png"
                  height="24"
                  width="24"
                  class="CToWUd"
                  data-bit="iit"
              /></a>
              <a href="#!" style="margin: 0px 5px"
                ><img
                  src="https://ci3.googleusercontent.com/meips/ADKq_NaU7_R8FjG2UwxvrWZSUUU73IRG2iFs8_qBNilTrT3JG-8Ph15h1m_VTMlwf75dgNCTeHCEKgiW_tJh7r_-Fizuk1M4eo2B9o-3=s0-d-e1-ft#https://www.topcv.vn/images/emails/color-link-48.png"
                  height="24"
                  width="24"
                  class="CToWUd"
                  data-bit="iit"
              /></a>
            </p>
          </div>
          <p style="font-size: 12px; color: #888; text-align: center">
            &copy; 2024 GNOUD. All rights reserved.
          </p>
        </div>
    
        <!-- Nhúng JavaScript của Bootstrap (tùy chọn) -->
        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
      </body>
    </html>    
  `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
};
exports.sendMailEmployerAcceptCv = sendMailEmployerAcceptCv;
const sendMailEmployerRefureCv = (email, subject, record) => {
    var _a, _b;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Page Title</title>

        <!-- Nhúng CSS của Bootstrap -->
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        />
      </head>
      <body style="margin: 0; padding: 0">
        <div class="background" style="background: #eee; padding: 20px">
          <div class="content" style="text-align: center">
            <div class="logo" style="padding: 0 30px 30px 30px; text-align: center">
              <h1
                style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  display: inline-block;
                  font-size: 30px;
                  font-weight: 700;
                  text-decoration: none;
                  color: #fda4c8;
                  margin-bottom: 0;
                  border-radius: 10px;
                  background-color: #fff;
                  padding: 0 10px;
                "
              >
                GNOUD
              </h1>
            </div>
            <div
              style="
                text-align: left;
                max-width: 600px;
                padding: 30px;
                border-radius: 5px;
                background: #fff;
                display: inline-block;
              "
              class="box-content"
            >
              <h3>Chào bạn <span style="color: #ff3f8c">${record["findName"]}</span></h3>
              <p>
                GNOUD chân thành cám ơn bạn đã ứng tuyển vào vị trí
                <strong style="color: #ff3f8c">${record === null || record === void 0 ? void 0 : record.title}</strong> của
                <strong style="color: #ff3f8c">${(_a = record === null || record === void 0 ? void 0 : record.employerId) === null || _a === void 0 ? void 0 : _a.companyName}</strong>.
                Chúng tôi hoan nghênh về việc ứng tuyển cũng như đánh giá cao tinh
                thần hợp tác và cầu tiến của bạn.
              </p>
              <p>
                Vì những yêu cầu đặc biệt cho vị trí này, sau khi nhà tuyển dụng xem
                xét kỹ lưỡng CV của bạn. Nhà tuyển dụng lấy làm tiếc thông báo: Tại
                thời điểm hiện tại
                <strong style="color: #ff3f8c">${(_b = record === null || record === void 0 ? void 0 : record.employerId) === null || _b === void 0 ? void 0 : _b.companyName}</strong> chưa
                có dự án nào thực sự phù hợp với năng lực và mức lương kỳ vọng của
                bạn. Nên công ty chưa có cơ hội hợp tác với bạn lần này.
              </p>
              <p>
                Tuy nhiên, sắp tới công ty sẽ có thêm nhiều dự án mới, chúng tôi rất
                mong bạn sẽ tiếp tục quan tâm và ứng tuyển vào các vị trí phù hợp
                khác của công ty.
              </p>
              <p>Trân trọng.</p>
              <p>GNOUD</p>
              <p
                style="
                  text-align: center;
                  font-style: italic;
                  font-size: 11px;
                  color: #888;
                "
              >
                -- Đây là email tự động. Xin bạn vui lòng không gửi phản hồi vào hộp
                thư này --
              </p>
            </div>
          </div>
          <div class="icon" style="margin-top: 20px">
            <p style="text-align: center">
              <a href="#!" style="margin: 0px 5px"
                ><img
                  src="https://ci3.googleusercontent.com/meips/ADKq_NbW9YGQtanfRmUJds-lyoUscd-GvLPhgIHsezOZYz0avAEFYKiZng9VYqM4njKrNPWYgopZhCsKzeMcQSk0IW9TAdSJ2z0hQjuf9VLV=s0-d-e1-ft#http://www.topcv.vn/images/emails/color-facebook-48.png"
                  height="24"
                  width="24"
                  class="CToWUd"
                  data-bit="iit"
                  jslog="32272; 1:WyIjdGhyZWFkLWY6MTc4OTI0ODczOTkwMjc3MTAzNiJd; 4:WyIjbXNnLWY6MTc4OTI0ODczOTkwMjc3MTAzNiJd"
              /></a>
              <a href="#!" style="margin: 0px 5px"
                ><img
                  src="https://ci3.googleusercontent.com/meips/ADKq_NbKllyHrY-x6VjdMcFyQZ2m_PbGr_KC2Sw87sjQUUgopv2f7GE1UaaSIkooBdr_Hs9nS0raubg-yDu4SJcly0ncbAq514Iid3oVpv8u=s0-d-e1-ft#https://www.topcv.vn/images/emails/color-twitter-48.png"
                  height="24"
                  width="24"
                  class="CToWUd"
                  data-bit="iit"
              /></a>
              <a href="#!" style="margin: 0px 5px"
                ><img
                  src="https://ci3.googleusercontent.com/meips/ADKq_NaU7_R8FjG2UwxvrWZSUUU73IRG2iFs8_qBNilTrT3JG-8Ph15h1m_VTMlwf75dgNCTeHCEKgiW_tJh7r_-Fizuk1M4eo2B9o-3=s0-d-e1-ft#https://www.topcv.vn/images/emails/color-link-48.png"
                  height="24"
                  width="24"
                  class="CToWUd"
                  data-bit="iit"
              /></a>
            </p>
          </div>
          <p style="font-size: 12px; color: #888; text-align: center">
            &copy; 2024 GNOUD. All rights reserved.
          </p>
        </div>
    
        <!-- Nhúng JavaScript của Bootstrap (tùy chọn) -->
        <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.1/dist/umd/popper.min.js"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
      </body>
    </html>    
  `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
};
exports.sendMailEmployerRefureCv = sendMailEmployerRefureCv;
