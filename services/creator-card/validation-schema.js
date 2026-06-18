const validator = require('@app-core/validator');

// Validation spec for creating a creator card
const createCardSpec = `root {
  title string<lengthBetween:3,100>
  description? string<maxLength:500>
  slug? string<lengthBetween:5,50>
  creator_reference string<length:20>
  links[] {
    title string<lengthBetween:1,100>
    url string<maxLength:200|startsWithProtocol>
  }
  service_rates? {
    currency string(NGN|USD|GBP|GHS)
    rates[] {
      name string<lengthBetween:3,100>
      description string<maxLength:250>
      amount number<min:1>
    }
  }
  status string(draft|published)
  access_type? string(public|private)
  access_code? string<length:6>
}`;

// Validation spec for deleting a creator card
const deleteCardSpec = `root {
  creator_reference string<length:20>
}`;

// Validation spec for slug field only
const slugSpec = `root {
  slug string<lengthBetween:5,50>
}`;

// Parse the specs outside the service functions
const parsedCreateSpec = validator.parse(createCardSpec);
const parsedDeleteSpec = validator.parse(deleteCardSpec);
const parsedSlugSpec = validator.parse(slugSpec);

module.exports = {
  parsedCreateSpec,
  parsedDeleteSpec,
  parsedSlugSpec,
};
