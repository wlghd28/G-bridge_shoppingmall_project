const   fs = require('fs');
const   express = require('express');
const   ejs = require('ejs');
const   mysql = require('mysql');
const   bodyParser = require('body-parser');
const   session = require('express-session');
const   methodOverride = require('method-override');
const   async = require('async');
const   router = express.Router();

const   db = mysql.createConnection({
    host: 'localhost',        // DB서버 IP주소
    port: 3306,               // DB서버 Port주소
    user: 'gbdbuser',            // DB접속 아이디
    password: 'jobbr1dge',  // DB암호
    database: 'bridge'         //사용할 DB명
});
router.use(methodOverride('_method'));
router.use(bodyParser.urlencoded({ extended: false }));
const PrintUserList = (req,res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;

       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminusermanage.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT userid, password, username, phonenum, address, point from u26_users where userid != 'admin'"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'회원조회 오류',
                                      'warn_message':'조회된 회원이 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                        userdata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'구매자관리기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 구매자관리 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};
const PrintUpdateform = (req,res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;

       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminupdateuser.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT userid from u26_users where userid != 'admin'"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});
           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'회원조회 오류',
                                      'warn_message':'조회된 회원이 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                        userdata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'구매자관리기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 구매자관리 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};

const PrintDeleteUserList = (req,res) => {
  let    htmlstream = '';
  let    htmlstream2 = '';
  let    sql_str;

       if (req.session.auth && req.session.admin)   {   // 관리자로 로그인된 경우에만 처리한다
           htmlstream = fs.readFileSync(__dirname + '/../views/header.ejs','utf8');    // 헤더부분
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/adminbar.ejs','utf8');  // 관리자메뉴
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/admindeleteuser.ejs','utf8'); // 괸리자메인화면
           htmlstream = htmlstream + fs.readFileSync(__dirname + '/../views/footer.ejs','utf8');  // Footer
           sql_str = "SELECT * from u26_users where userid != 'admin'"; // 상품조회SQL

           res.writeHead(200, {'Content-Type':'text/html; charset=utf8'});

           db.query(sql_str, (error, results, fields) => {  // 상품조회 SQL실행
               if (error) { res.status(562).end("AdminPrintProd: DB query is failed"); }
               else if (results.length <= 0) {  // 조회된 상품이 없다면, 오류메시지 출력
                   htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                   res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'회원조회 오류',
                                      'warn_message':'조회된 회원이 없습니다.',
                                      'return_url':'/' }));
                   }
              else {  // 조회된 상품이 있다면, 상품리스트를 출력
                     res.end(ejs.render(htmlstream,  { 'title' : '쇼핑몰site',
                                                       'logurl': '/users/logout',
                                                       'loglabel': '로그아웃',
                                                       'regurl': '/users/profile',
                                                       'reglabel': req.session.who,
                                                        userdata : results }));  // 조회된 상품정보
                 } // else
           }); // db.query()
       }
       else  {  // (관리자로 로그인하지 않고) 본 페이지를 참조하면 오류를 출력
         htmlstream = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
         res.status(562).end(ejs.render(htmlstream, { 'title': '알리미',
                            'warn_title':'구매자관리기능 오류',
                            'warn_message':'관리자로 로그인되어 있지 않아서, 구매자관리 기능을 사용할 수 없습니다.',
                            'return_url':'/' }));
       }
};

const UpdateUser = (req,res) => {
  let    sql_str;
  let    body = req.body;

    sql_str = "UPDATE u26_users set username = ?, phonenum = ?, address = ?, point = ? where userid = ?";

    db.query(sql_str,[body.username, body.phonenum, body.address, body.point, body.userid], (error, results, fields) => {  // 상품조회 SQL실행
        if (error) {
            //res.status(562).end("AdminPrintProd: DB query is failed")  // 조회된 상품이 없다면, 오류메시지 출력
            console.log(error);
            htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
            res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                              'warn_title':'회원정보수정 오류',
                              'warn_message':'조회된 회원이 없습니다.',
                              'return_url':'/' }));
        }else{
          res.redirect('/adminusermanage');
        }
    }); // db.query()


};

const DeleteUser = (req,res) => {
  let    sql_str;
  let    body = req.body;
    sql_str1 = "DELETE from u26_users where usernum = ?";
    console.log(body.usernum);
    //console.log(typeof(body.usernum));
    if(typeof(body.usernum) == "string"){
      db.query(sql_str,[body.usernum], (error, results, fields) => {  // 상품조회 SQL실행
          if (error) {
              //res.status(562).end("AdminPrintProd: DB query is failed")  // 조회된 상품이 없다면, 오류메시지 출력
              console.log(error);
              htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
              res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                'warn_title':'회원삭제 오류',
                                'warn_message':'조회된 회원이 없습니다.',
                                'return_url':'/' }));
          }else{
            res.redirect('/adminusermanage');
          }
      }); // db.query()
    }else{
      async.waterfall([ // 여러명의 회원을 삭제할 경우에는 비동기식을 동기식으로 바꿔준다.
        function(callback){
          for(var i=0;i<body.usernum.length;i++){
            db.query(sql_str,[body.usernum[i]], (error, results, fields) => {  // 상품조회 SQL실행
                if (error) {
                    //res.status(562).end("AdminPrintProd: DB query is failed")  // 조회된 상품이 없다면, 오류메시지 출력
                    console.log(error);
                    htmlstream2 = fs.readFileSync(__dirname + '/../views/alert.ejs','utf8');
                    res.status(562).end(ejs.render(htmlstream2, { 'title': '알리미',
                                      'warn_title':'회원삭제 오류',
                                      'warn_message':'조회된 회원이 없습니다.',
                                      'return_url':'/' }));
                    }
            }); // db.query()
          }
          callback(null);
        }
      ], function(error, result){
        if(error){
          console.log(error);
        }
      });
      res.redirect('/adminusermanage');
    }
};


router.get('/', PrintUserList);// 구매자 리스트를 출력
router.get('/update', PrintUpdateform);
router.get('/delete', PrintDeleteUserList);
router.put('/update', UpdateUser);
router.delete('/delete', DeleteUser);
router.get('/', function(req, res) { res.send('respond with a resource 111'); });

module.exports = router;
