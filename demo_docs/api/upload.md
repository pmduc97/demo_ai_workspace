# POST /api/upload — Upload Ảnh

## Thông tin
- **Method**: POST
- **Endpoint**: `/api/upload`
- **Auth**: Bearer token (Member+)
- **Controller**: `src/controllers/uploadController.js` → `upload`
- **Middleware**: Multer

## Request

**Content-Type**: `multipart/form-data`

| Field | Type | Required | Validation |
|---|---|---|---|
| file | File | Có | Chỉ chấp nhận image/jpeg, image/png, image/webp. Tối đa 5MB |

## Response

**200 OK**:
```json
{ "url": "/uploads/1704067200000-abc123.jpg" }
```

**400 Bad Request** (sai định dạng):
```json
{ "message": "Chỉ chấp nhận file ảnh (jpg, png, webp)" }
```

**400 Bad Request** (quá kích thước):
```json
{ "message": "File không được vượt quá 5MB" }
```

## Cấu hình Multer

```js
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  cb(null, allowed.includes(file.mimetype));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
```

## Logic xử lý
1. Middleware `auth`
2. Multer xử lý upload, lưu file vào `uploads/`
3. Trả về URL dạng `/uploads/<filename>`
4. File được serve static qua `express.static('uploads')` với prefix `/uploads`
