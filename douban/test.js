var request = require("request");

var options = { method: 'GET',
  url: 'https://154.8.131.171/api/v2/search',
  qs: 
   { douban_udid: 'a4c927eb8f679182a59af9d25fe566c93433019f',
     version: '6.6.0',
     udid: '47758d0584f771a237a625bec3490b68ee6f84eb',
     event_loc_id: '108296',
     _ts: '1544608163',
     apikey: '0ab215a8b1977939201640fa14c66bab',
     q: '%E5%81%A5%E8%BA%AB%E6%88%BF',
     latitude: '31.20492905673621',
     start: '0',
     count: '15',
     loc_id: '108296',
     _sig: '6mSdurza2%2ByN06o5ZoNNFaZhj1c%3D',
     longitude: '121.4786610182419' },
  headers: 
   { 'Postman-Token': 'a7f17c96-0c40-4ccb-b222-dbb8d6b30ca6',
     'cache-control': 'no-cache',
     Host: 'frodo.douban.com',
     'User-Agent': 'api-client/0.1.3 com.douban.frodo/6.6.0 iOS/12.1 model/iPhone9,1 network/wifi',
     Authorization: 'Bearer bed32691fe5b04f13c7973b5fb110ed3' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

