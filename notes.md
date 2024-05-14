## 1. What is the project?

To build a browser form which collects Email, Country, Zip Code, Password and Password Confirmation fields. The validation should be live and inline.

The form should show an error when submitting with invalid fields.

## 2. What is the MVP?

All of the validation logic should happen in JavaScript.

## 3. What are the nice-to-haves?

It should look good.

## 4. When will the project be complete?

Once the project requirements are met.

# Project Notes

Start validating a field at an onblur event.
A retyping and typing field should be linked once they have both been onblur-ed.
example:
email address field and retype email address field should update their validation when the other one's content is updated.
This should only happen after they both have been typed in and blurred out of.
