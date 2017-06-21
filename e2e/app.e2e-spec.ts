import { CodingChallengOnePage } from './app.po';

describe('coding-challeng-one App', () => {
  let page: CodingChallengOnePage;

  beforeEach(() => {
    page = new CodingChallengOnePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
