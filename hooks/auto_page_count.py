# -*- coding: utf-8 -*-
"""
MkDocs Hook：自动统计 docs 目录下收录的页面总数（不含 index.md），
并在渲染首页 index.md 时把数字注入到 data-total 属性里，
从而让首页计数动画无需手动维护数字。

用法：
1. 在 mkdocs.yml 中添加：
       hooks:
         - hooks.auto_page_count
2. 在首页 index.md 中写：
       <div class="page-counter" data-total="__AUTO__">...</div>
   构建时 data-total 的值会被自动替换为真实页面数。
"""

from __future__ import annotations

import re
from pathlib import Path

TOTAL_PATTERN = re.compile(r'data-total\s*=\s*"[^"]*"')


def _count_pages(docs_dir: Path) -> int:
    """统计 docs 目录下所有 .md 页面（排除 index.md），使用 mkdocs.yml 中同样的导航逻辑。
    这里简单起见：所有 *.md 扣除 index.md。
    """
    return sum(
        1 for md in docs_dir.rglob("*.md")
        if md.is_file() and md.name.lower() != "index.md"
    )


def on_page_markdown(markdown: str, *, page, config, files):
    """MkDocs 事件：在 Markdown 被渲染为 HTML 之前触发。"""
    # 只处理首页（index.md）
    if not page or getattr(page, "file", None) is None:
        return markdown
    page_file = page.file
    # 多种写法兼容：直接叫 index.md 或 dest_path 是 index.html
    src_name = (page_file.src_path or "").split("/")[-1]
    dest_name = (page_file.dest_path or "").split("/")[-1]
    if src_name.lower() != "index.md" and dest_name.lower() != "index.html":
        return markdown
    if "__AUTO__" not in markdown and 'data-total="' not in markdown:
        return markdown

    docs_dir = Path(config.get("docs_dir", "docs"))
    if not docs_dir.is_absolute():
        docs_dir = (Path(config.get("config_file_path", ".")) / ".." / docs_dir).resolve()

    total = _count_pages(docs_dir)

    # 替换 data-total="xxx" 为真实数字；若不存在则保留原样
    new_md, n_subs = TOTAL_PATTERN.subn(f'data-total="{total}"', markdown, count=1)
    if n_subs == 0:
        # 兜底：若 data-total="__AUTO__" 写成了别的形式
        new_md = markdown.replace("__AUTO__", str(total))
    return new_md
