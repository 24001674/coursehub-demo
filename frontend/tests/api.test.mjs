import test from "node:test";
import assert from "node:assert/strict";
import { api } from "../src/api.js";

const originalFetch = globalThis.fetch;

function mockFetch(responseOrError) {
  globalThis.fetch = async (...args) => {
    if (responseOrError instanceof Error) {
      throw responseOrError;
    }
    return responseOrError;
  };
}

function mockResponse(status, body = "") {
  return {
    status,
    ok: status >= 200 && status < 300,
    text: async () => body,
  };
}

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("1. GET trả về dữ liệu JSON", async () => {
  mockFetch(mockResponse(200, JSON.stringify([{ id: 1 }])));

  const result = await api("/api/enrollments");

  assert.deepEqual(result, [{ id: 1 }]);
});

test("2. POST gửi body JSON", async () => {
  let requestOptions;

  globalThis.fetch = async (url, options) => {
    requestOptions = options;
    return mockResponse(201, JSON.stringify({ id: 1 }));
  };

  const result = await api("/api/enrollments", {
    method: "POST",
    body: { student_id: "22000004", section_id: "WEB-01" },
  });

  assert.equal(requestOptions.method, "POST");
  assert.equal(requestOptions.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(requestOptions.body), {
    student_id: "22000004",
    section_id: "WEB-01",
  });
  assert.deepEqual(result, { id: 1 });
});

test("3. DELETE trả về 204 thì kết quả là null", async () => {
  mockFetch(mockResponse(204));

  const result = await api("/api/enrollments/1", {
    method: "DELETE",
  });

  assert.equal(result, null);
});

test("4. HTTP 409 trả về lỗi có status", async () => {
  mockFetch(
    mockResponse(409, JSON.stringify({ detail: "Section is full" })),
  );

  await assert.rejects(
    api("/api/enrollments", { method: "POST", body: {} }),
    (error) => {
      assert.equal(error.status, 409);
      assert.match(error.message, /Section is full/);
      return true;
    },
  );
});

test("5. HTTP 422 trả về lỗi validation", async () => {
  mockFetch(
    mockResponse(
      422,
      JSON.stringify({
        detail: [{ msg: "Field required" }],
      }),
    ),
  );

  await assert.rejects(
    api("/api/enrollments", { method: "POST", body: {} }),
    (error) => {
      assert.equal(error.status, 422);
      assert.match(error.message, /Field required/);
      return true;
    },
  );
});

test("6. Lỗi mạng được chuyển thành thông báo dễ hiểu", async () => {
  mockFetch(new Error("Network failure"));

  await assert.rejects(
    api("/api/enrollments"),
    /Kiểm tra Backend\/CORS/,
  );
});

test("7. AbortError được giữ nguyên", async () => {
  const error = new Error("Request aborted");
  error.name = "AbortError";
  mockFetch(error);

  await assert.rejects(api("/api/enrollments"), {
    name: "AbortError",
  });
});
test("8. Phản hồi không phải JSON trả về lỗi", async () => {
  mockFetch(mockResponse(200, "not-json"));

  await assert.rejects(
    api("/api/enrollments"),
    /phản hồi không phải JSON/,
  );
});