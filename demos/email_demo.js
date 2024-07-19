function loadScrpit(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.onload = callback;
  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}

function initEmail() {
  emailjs.init({
    publicKey: "MiINJFxV_IUgwKW5x",
    privateKey: "cK5lMKXKwxiB03PpsD_1N",
    // Do not allow headless browsers
    //   blockHeadless: true,
  });

  // 发送邮件的函数
  function sendEmail() {
    const serviceID = "service_phlvo8u";
    const templateID = "template_8edbqyl";
    const templateParams = {
      //   to_email: "2300801795@qq.com",
      //   to_email: "2860677067@qq.com",
      to_name: "zhukuan",
      // from_email: 'sender@example.com',
      // subject: 'Test Email',
      message: "gpu33",
    };

    emailjs.send(serviceID, templateID, templateParams).then(
      function (response) {
        console.log("Email sent successfully!", response.status, response.text);
      },
      function (error) {
        console.error("Failed to send email:", error);
      }
    );
  }

  setTimeout(sendEmail, 1000);
}

loadScrpit(
  "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
  initEmail
);
