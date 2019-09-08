const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   url = require('url');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   multer = require('multer');
// 업로드 디렉터리를 설정한다. 실제디렉터리: /home/bmlee/
// const  upload = multer({dest: __dirname + '/../uploads/products'});
const   router = express.Router();

// router.use(bodyParser.urlencoded({ extended: false }));
const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: 'gbdbuser',            // DB접속 아이디
    password: 'jobbr1dge',  // DB암호
    database: 'bridge'         //사용할 DB명
});
//  -----------------------------------  상품리스트 기능 -----------------------------------------
// (관리자용) 등록된 상품리스트를 브라우져로 출력합니다.
const PrintCategoryProd = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str, search_cat;
  const  query = url.parse(req.url, true).query;

       console.log(query.category);

       if (req.session.auth)   {   // 로그인된 경우에만 처리한다

           switch (query.category) {
               case 'fan' : search_cat = "선풍기"; break;
               case 'aircon': search_cat = "에어컨"; break;
               case 'aircool': search_cat = "냉풍기"; break;
               case 'fridge': search_cat = "냉장고"; break;
               case 'minisun': search_cat = "미니선풍기"; break;
               default: search_cat = "선풍기"; break;
           }

           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/product.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT manufacturer, productname, model, rdate, price, pic from u26_products where producttype='" + search_cat + "' order by rdate desc;"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'상품조회 오류',
                                      'warn_message':'조회된 상품이 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                       'category': search_cat,
                                                        prodata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'로그인 필요',
                            'warn_message':'상품검색을 하려면, 로그인이 필요합니다.',
                            'return_url':'/' }));
       }
};

// 사용자용 제품검색
const PrintSearchProdForm = (req, res) => {
  let    htmlstream = '';

  htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 일반사용자메뉴
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/usersearchprodform.ejs','utf8'); // Contentmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
  htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
  res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
  if (req.session.auth) {  // true :로그인된 상태,  false : 로그인안된 상태
      res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                        'logurl': '/users/logout',
                                        'loglabel': '로그아웃',
                                        'regurl': '/users/profile',
                                        'reglabel':req.session.who }));  // 세션에 저장된 사용자명표시
  }
  else {
     res.end(ejs.render(htmlstream, { 'title' : '쇼핑몰site',
                                     'logurl': '/users/auth',
                                     'loglabel': '로그인',
                                     'regurl': '/users/reg',
                                     'reglabel':'가입' }));
  }
};


const SearchProd = (req, res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;
  const  query = url.parse(req.url, true).query;
       //console.log(body.productname);
       console.log(query);
       if (req.session.auth)   {   // 로그인된 경우에만 처리한다

           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/navbar.ejs','utf8');  // 사용자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/usersearchprod.ejs','utf8'); // 카테고리별 제품리스트
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT manufacturer, productname, model, rdate, price, pic from u26_products where producttype = ? and productname = ? and manufacturer = ? and model = ? order by rdate desc;"; // 상품조회SQL
           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
           db.query(sql_str, [query.producttype, query.productname, query.manufacturer, query.model],(error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'상품조회 오류',
                                      'warn_message':'조회된 상품이 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                       'category': query.producttype,
                                                        prodata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'로그인 필요',
                            'warn_message':'상품검색을 하려면, 로그인이 필요합니다.',
                            'return_url':'/' }));
       }
};

// REST API의 URI와 핸들러를 매핑합니다.
router.get('/list', PrintCategoryProd);      // 상품리스트를 화면에 출력
router.get('/searchprodform', PrintSearchProdForm);
router.get('/searchprod', SearchProd);
module.exports = router;
