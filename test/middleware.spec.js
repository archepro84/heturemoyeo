const authMiddleware = require("../middleware/auth-middleware");
const authMiddlewareAll = require("../middleware/auth-middlewareAll");
const loginCheckMiddleware = require("../middleware/login-check-middleware");

jest.mock("../models"); // mocking을 이용한다.

const { Users } = require("../models");

// ************************auth-middleware 테스트 코드***************************
// TODO: Users.findByPk가 제대로 찾아지지 않음
// test("authMiddleware 정상적인 토큰을 넣은 경우", () => {
//     Users.findByPk = jest.fn(); // Users.findByPk 함수 모킹

//     authMiddleware(
//         {
//             // cookies: {
//             //     authorization: undefined,
//             // },
//             headers: {
//                 authorization:
//                     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyODEzMDgwN30.fizpZlhmxstJcUgPweHLNTfUQarVO6T97HBCGwShaU4",
//             },
//         },
//         {
//             status: () => ({
//                 send: () => {},
//             }),
//             locals: {},
//         }
//     );

//     expect(Users.findByPk).toHaveBeenCalledTimes(1); // Users.findByPk는 1번 실행됐다.
//     expect(Users.findByPk).toHaveBeenCalledWith(99); // userId로 1을 입력받았다.
// });
// TODO: 마찬가지로 Users.findByPk가 제대로 찾아지지 않는듯
// test("authMiddleware 에러가 나는 경우", () => {
//     const mockedSend = jest.fn();

//     authMiddleware(
//         {
//             // cookies: {
//             //     authorization: "",
//             // },
//             headers: {
//                 authorization: "",
//             },
//         },
//         {
//             status: () => ({
//                 send: mockedSend,
//             }),
//             locals: {},
//         }
//     );

//     expect(mockedSend).toHaveBeenCalledWith({
//         errorMessage: "사용자 인증에 실패하였습니다.",
//     });
// });

// ************************auth-middlewareAll 테스트 코드***************************
// TODO: 위와 마찬가지
// test("authMiddlewareAll 정상적인 토큰을 넣은 경우", () => {
//     Users.findByPk = jest.fn(); // Users.findByPk 함수 모킹

//     authMiddleware(
//         {
// cookies: {
//                 authorization: "",
//             },
//             headers: {
//                 authorization:
//                     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjF9.GfGglhxnkRIBL-vvBNxIzG5JboWutbIXJdWeShbJ9DM",
//             },
//         },
//         {
//             status: () => ({
//                 send: () => {},
//             }),
//             locals: {},
//         }
//     );

//     expect(Users.findByPk).toHaveBeenCalledTimes(1); // Users.findByPk는 1번 실행됐다.
//     expect(Users.findByPk).toHaveBeenCalledWith(1); // userId로 1을 입력받았다.
// });

// test("authMiddlewareAll 에러가 나는 경우", () => {
//     const mockedSend = jest.fn();

//     authMiddleware(
//         {
//             cookies: {
//                 authorization: "",
//             },
//             headers: {
//                 authorization: "",
//             },
//         },
//         {
//             status: () => ({
//                 send: mockedSend,
//             }),
//             locals: {},
//         }
//     );

//     expect(mockedSend).toHaveBeenCalledWith({
//         errorMessage: "사용자 인증에 실패하였습니다.",
//     });
// });



// ************************login-check-middleware 테스트 코드***************************
test("login-check-middleware 정상적인 토큰을 넣은 경우", () => {
    const mockedSend = jest.fn();
    Users.findByPk = jest.fn(); // Users.findByPk 함수 모킹

    authMiddleware(
        {
            cookies: {
                authorization: "",
            },
            headers: {
                authorization:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjF9.GfGglhxnkRIBL-vvBNxIzG5JboWutbIXJdWeShbJ9DM",
            },
        },
        {
            status: () => ({
                send: mockedSend,
            }),
            locals: {},
        }
    );

    expect(Users.findByPk).toHaveBeenCalledTimes(1); // Users.findByPk는 1번 실행됐다.
    expect(Users.findByPk).toHaveBeenCalledWith(1); // userId로 1을 입력받았다.

    expect(mockedSend).toHaveBeenCalledWith({
        errorMessage: "로그인한 사용자는 접근이 불가능 합니다.",
    });
});
