class Seo {

  constructor() {
    DocHead.setTitle('Dr. Mongo');
  }

  setTitle(title) {
    DocHead.setTitle(title + ' | Dr. Mongo');
  }

}


seo = new Seo();
