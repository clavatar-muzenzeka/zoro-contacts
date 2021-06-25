/**
 * By clavatar
 */

const mongoose = require("mongoose");
const baseShema = require("./_base.schema");
const { extendSchema } = require("../custom-modules/zoro-utils");
const { getEnumValues } = require("../custom-modules/zoro-utils");

/**
 * Zoro specific packages
 */
const {
  ZoroErrorEmailAddressValueRequired,
  ZoroErrorEmailAddressTypeInvalid,
  ZoroErrorPhoneNumberValueRequired,
  ZoroErrorCanonicalPhoneNumberBegin,
  ZoroErrorInvalidCoutryCode,
  ZoroErrorPhoneNumberValueBegin,
  ZoroErrorOrganizationLocationRequired,
  ZoroErrorFunctionRequired,
  ZoroErrorOrganizationNameRequired,
  ZoroErrorGivenNameRequired,
  ZoroErrorPhoneNumberListCanNotBeEmpty,
  ZoroErrorInvalidPhoneNumberType,
} = require("../custom-modules/zoro-errors-glossary/zoro-errors-glossary");

/**
 * Email addresse types enum
 */
const EmailAddresseTypeEnum = {
  HOME: "home",
  WORK: "work",
  OTHER: "other",
};

/**
 * Phone numbers types
 */
const PhoneNumberTypeEnum = {
  HOME: "home",
  WORK: "work",
  MOBILE: "mobile",
};

/**
 * County codes enum
 */
const CountryCodesEnum = {
  DRC: "+243",
  FRANCE: "+33",
};

/**
 * Canoniacal phone number regex
 */
CANONICAL_PHONE_NUMBER_BEGIN_REGEX = /^(?!0.*$).*/;

/**
 * contact schema
 */
var ContactSchema = new mongoose.Schema(
  {
    favorite: {
      type: Boolean,
      default: false,
    },
    resourceName: {
      type: String,
    },
    etag: {
      type: String,
    },

    emailAddresses: {
      type: [
        {
          value: {
            type: String,
            required: [ZoroErrorEmailAddressValueRequired.message],
          },
          type: {
            type: String,
            enum: {
              values: getEnumValues(EmailAddresseTypeEnum),
              message: ZoroErrorEmailAddressTypeInvalid.message,
            },

            default: EmailAddresseTypeEnum.WORK,
          },
        },
      ],
    },
    phoneNumbers: {
      type: [
        {
          value: {
            type: String,
            required: [ZoroErrorPhoneNumberValueRequired.message],
            validate: {
              validator: function (v) {
                return (
                  v == null ||
                  v.trim().length < 1 ||
                  CANONICAL_PHONE_NUMBER_BEGIN_REGEX.test(v)
                );
              },
              message: ZoroErrorPhoneNumberValueBegin.message,
            },
          },
          countryCode: {
            type: String,
            enum: {
              values: getEnumValues(CountryCodesEnum),
              message: ZoroErrorInvalidCoutryCode.message,
            },
            default: CountryCodesEnum.DRC,
          },
          canonicalForm: {
            type: String,
            validate: {
              validator: function (v) {
                return (
                  v == null ||
                  v.trim().length < 1 ||
                  CANONICAL_PHONE_NUMBER_BEGIN_REGEX.test(v)
                );
              },
              message: ZoroErrorCanonicalPhoneNumberBegin.message,
            },
          },
          type: {
            type: String,
            enum: {
              values: getEnumValues(PhoneNumberTypeEnum),
              message: ZoroErrorInvalidPhoneNumberType.message,
            },
            default: PhoneNumberTypeEnum.WORK,
          },
        },
      ],

      validate: [
        (v) => Array.isArray(v) && v.length > 0,
        ZoroErrorPhoneNumberListCanNotBeEmpty.message,
      ],
    },

    names: [
      {
        familyName: {
          type: String,
        },
        givenName: {
          type: String,
          required: [true, ZoroErrorGivenNameRequired.message],
        },
        middleName: { type: String },
      },
    ],
    organizations: [
      {
        name: {
          type: String,
          required: [true, ZoroErrorOrganizationNameRequired.message],
        },
        department: { type: String },
        title: {
          type: String,
          required: [true, ZoroErrorFunctionRequired.message],
        },
        location: {
          type: String,
          required: [true, ZoroErrorOrganizationLocationRequired.message],
        },
      },
    ],
  },
  { timestamps: true }
);

// base schema extention
let extendedSchema = extendSchema(baseShema, ContactSchema);

// export created model
module.exports = mongoose.model("contact", extendedSchema);
