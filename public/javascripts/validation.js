//////////////  REGISTER  //////////////////

    $(document).ready(function() {


      // Validate First Name

      $("#firstNameError").hide();

      let firstNameError = true;

      $("#inputFirstName").keyup(function () {

        validateFirstname();

      });


      function validateFirstname() {

        let firstNameValue = $("#inputFirstName").val();

        if (firstNameValue.length == "") {

          $("#firstNameError").show();

          $("#firstNameError").html("*Please enter the First Name");

          firstNameError = false;

          return false;

        } else if (firstNameValue.length < 3 || firstNameValue.length > 10) {

          $("#firstNameError").show();

          $("#firstNameError").html("*Minimum Length 3 and Maximum length 10");

          firstNameError = false;

          return false;

        } else {

          $("#firstNameError").hide();

          firstNameError = true;

        }

      }


      // Validate Email

      validateEmail();

      function validateEmail () {
        const email = document.getElementById("inputEmail");

      email.addEventListener("blur", () => {

        let regex = /^([\-\.0-9a-zA-Z]+)@([\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/;

        let s = email.value;

        if (regex.test(s)) {

          email.classList.remove("is-invalid");

          $("#emailError").hide();

          emailError = true;

        } else {

          email.classList.add("is-invalid");

          $("#emailError").html("*Please enter the Valid Email");

          emailError = false;

        }

      });
      }

      // Validate Phone Number

      $("#PhoneNoError").hide();

      let phoneNoError = true;

      $("#inputPhone").keyup(function () {

        validatePhoneNo();

      });


      function validatePhoneNo() {

        let PhoneNoValue = $("#inputPhone").val();

        let regex = /[^0-9]/g;

        if (regex.test(PhoneNoValue)) {
          $("#PhoneNoError").show();

          $("#PhoneNoError").html("*Please enter the Numbers");
        } else if (PhoneNoValue.length == "") {

          $("#PhoneNoError").show();

          $("#PhoneNoError").html("*Please enter your Phone Number");

          phoneNoError = false;

          return false;

        } else if (PhoneNoValue.length > 10) {

          $("#PhoneNoError").show();

          $("#PhoneNoError").html("*Please enter correct Phone No");

          phoneNoError = false;

          return false;

        } else {

          $("#PhoneNoError").hide();

          phoneNoError = true;

        }

      }


      // Validate Password

      $("#PasswordError").hide();

      let passwordError = true;

      $("#inputPassword").keyup(function () {

        validatePassword();

      });

      function validatePassword() {

        let passwordValue = $("#inputPassword").val();

        if (passwordValue.length == "") {

          $("#PasswordError").show();

          $("#PasswordError").html(

            "*Please enter the Password"

          );

          passwordError = false;

          return false;

        } else if (passwordValue.length < 6) {

          $("#PasswordError").show();

          $("#PasswordError").html(

            "*Minimum 6 character"

          );

          passwordError = false;

          return false;

        } else {

          $("#PasswordError").hide();

          passwordError = true;

        }

      }


      // Validate Confirm Password

      $("#ConfPasswordError").hide();

      let confirmPasswordError = true;

      $("#inputConfPassword").keyup(function () {

        validateConfirmPassword();

      });

      function validateConfirmPassword() {

        let confirmPasswordValue = $("#inputConfPassword").val();

        let passwordValue = $("#inputPassword").val();

        if (passwordValue != confirmPasswordValue) {

          $("#ConfPasswordError").show();

          $("#ConfPasswordError").html("*Password didn't Match");

          confirmPasswordError = false;

          return false;

        } else {

          $("#ConfPasswordError").hide();

          confirmPasswordError = true;

        }

      }


      // Submit button

      $("#register").click(function () {

        validateFirstname();

        validatePhoneNo();

        validatePassword();

        validateConfirmPassword();

        validateEmail();

        const email = document.getElementById("inputEmail").value
        console.log(email)
        let errorEmail = true
        if(email.length == 0){
          errorEmail == false
          $("#emailError").html("*Please enter your email");
        }

        console.log(firstNameError)
        console.log(phoneNoError)
        console.log(passwordError)
        console.log(confirmPasswordError)
        console.log(emailError)

        if (firstNameError == true && phoneNoError == true && passwordError == true && confirmPasswordError == true && emailError==true && errorEmail == true) {

          return true;

        } else {

          return false;

        }

      });
    });

    //////////////  ADD PRODUCT  //////////////////

    // $(document).ready(function() {


    //   // Validate First Name

    //   $("#pnameError").hide();

    //   let PNameError = true;

    //   $("#pname").keyup(function () {

    //     validatePName();

    //   });


    //   function validatePName() {

    //     let pnameValue = $("#pname").val();

    //     if (pnameValue.length == "") {

    //       $("#pnameError").show();

    //       $("#pnameError").html("*Please enter the Product Nmae");

    //       PNameError = false;

    //       return false;

    //     } else {

    //       $("#pnameError").hide();

    //       PNameError = true;

    //     }

    //   }

    //   // Submit button

    //   $("#add-product").click(function () {

    //     validatePName();

    //     if (PNameError == true) {

    //       return true;

    //     } else {

    //       return false;

    //     }

    //   });
    // });

    //////////////  ADD COUPON  //////////////////



    //////////////  ADD CATEGORY  //////////////////