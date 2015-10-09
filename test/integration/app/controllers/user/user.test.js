// Copyright 2015, Google, Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

module.exports = function (container, assert, testRequest, Promise, createSessionCookie) {
  return function () {
    let app, userSession;

    beforeEach(function () {
      app = container.get('app');
      userSession = container.get('userSession');
    });

    it('should return 200 and an empty body if no authenticated user', Promise.coroutine(function* () {
      let response = yield testRequest(app)
                            .get('/api/user')
                            .expect(200);

      assert.deepEqual(response.body, {}, 'Response body should be empty');
    }));

    it('should return 200 and the authenticated user', Promise.coroutine(function* () {
      let response = yield testRequest(app)
                            .get('/api/user')
                            .set('Cookie', createSessionCookie(userSession))
                            .use(testRequest.fixJson)
                            .expect(200);

      assert.deepEqual(response.body, {
        id: userSession.passport.user.id,
        login: userSession.passport.user.login,
        avatar_url: userSession.passport.user.avatar_url
      }, 'Response body should be the authenticated user');
    }));
  };
};