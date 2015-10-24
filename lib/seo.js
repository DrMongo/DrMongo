class Seo {

  constructor() {
    DocHead.setTitle('Dr. Mongo');
  }

  setTitle(title) {
    if (title) {
      DocHead.setTitle(title + ' | Dr. Mongo');
    } else {
      DocHead.setTitle('Dr. Mongo');
    }
  }

}


seo = new Seo();
