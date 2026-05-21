---
date: {{date:YYYY-MM-DD}}
type: daily
week: {{date:W}}
---

## 🎯 Focus hôm nay

> Deep Work target: **X giờ**

### Deep Work blocks
- [ ] 09:00–11:00 | {{deep_task_1}}
- [ ] 14:00–16:00 | {{deep_task_2}}

### Shallow Work
- [ ] {{shallow_tasks}}

## 📥 Brain Dump

<!-- Paste thô vào đây, script sẽ xử lý -->

## 📊 Cuối ngày

- Deep Work thực tế: X giờ
- Năng lượng tổng thể: 🔴 Thấp / 🟡 Trung bình / 🟢 Cao
- Ghi chú:

## 🔗 Notes được tạo hôm nay

```dataview
LIST
FROM ""
WHERE created = date("{{date:YYYY-MM-DD}}")
SORT file.name ASC
```
