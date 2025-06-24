## BEM

BEM（Block Element Modifier）是一种流行的CSS命名约定，旨在提高CSS代码的可维护性和可重用性。它通过明确组件结构来减少样式冲突。

### 命名规范
- **Block**：独立的组件或对象（如`el-test`）
- **Element**：依赖于Block的子元素（如`el-test__title`）
- **Modifier**：表示Block或Element的不同状态或变体（如`el-test--description`）

### SCSS Mixin 实现

::: code-group BEM
```scss [bem.scss]
    $namespace: 'el' !default;
    $block-set: '-' !default;
    $elem-set: '__' !default;
    $mod-set: '--' !default;

    @mixin b($block) {
        $B: $namespace+$block-set+$block;

        .#{$B} {
            @content;
        }
    }

    @mixin e($el) {
        $selector: &;
         @at-root {
            #{$selector+$elem-set+$el} {
                @content;
            }
        }
    }

    @mixin m($m) {
        $selector: &;
        @at-root {
            #{$selector+$mod-set+$m} {
                @content;
            }
        }
    }
```

```scss [test.scss]
@include b('test'){
    color: red; // Block的样式
    
    @include e('title') {
        color: blue; // Element的样式
    }

    @include m('description') {
        color: green; // Modifier的样式
    }
}
```

```tsx [test.tsx]
import './test.scss'
export default function About() {
  return (
    <div className="el-test">
      自定义bem样式
      <h1 className="el-test__title">About Page</h1> <!-- Element示例 -->
      <p className="el-test--description">This is the about page.</p> <!-- Modifier示例 -->
    </div>
  );
}
```
:::

### 示例解析
- `el-test`：基础块（Block）
- `el-test__title`：元素（Element），属于`test`块的一部分
- `el-test--description`：修饰符（Modifier），表示`test`块的一种特殊状态或变体