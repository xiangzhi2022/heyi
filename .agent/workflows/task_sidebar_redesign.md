---
description: Redesign Global Sidebar and Optimize Layout
---

# Global Sidebar Redesign & Optimization

## Objective
Redesign the `GlobalSidebar` component to be truly global, fix layout overflow issues, and integrate new sections for Tokens, Development Activities, Help, and Settings.

## Current Issues
1. **Layout Mismatch**: Sidebar collapsed width (`w-20`) does not match the content margin (`lg:ml-16`) in `App.jsx`.
2. **Missing Features**: "Tokens", "Development Activities", "Help", and "Settings" are missing or placeholders.
3. **Organization**: "Market" section needs to clearly correspond to "Copyright Market".

## Implementation Steps

### 1. Update App Layout
- [ ] Modify `src/App.jsx` to correct the left margin for the main content area to match the sidebar's collapsed width (`lg:ml-20`).

### 2. Redesign GlobalSidebar Component
- [ ] Refactor `src/components/GlobalSidebar.jsx`.
- [ ] **Structure**:
    - **Logo Area**: Keep existing.
    - **Core Navigation**:
        - Home (发现)
        - Copyright Market (版权市场) -> `/marketplace`
        - Rights Center (权利中心) -> `/rights-center`
    - **Creator Tools**:
        - Registration (版权登记) -> `/registration`
        - My Assets (个人中心) -> `/account`
    - **Ecosystem (New)**:
        - Tokens (代币) -> Placeholder/Modal
        - Development Activities (开发活动) -> Placeholder/Modal
    - **Footer Navigation**:
        - Help (帮助) -> Placeholder/Modal
        - Settings (设置) -> Placeholder/Modal
- [ ] **Styling**: Ensure consistent spacing and hover effects.
- [ ] **Responsiveness**: Ensure it works well on large screens and hides correctly on small screens (mobile nav handles small screens).

### 3. Add Placeholders for New Features
- [ ] Implement simple "Coming Soon" toasts or modals for "Tokens", "Activities", "Help", and "Settings" to provide feedback.

## Future Recommendations
- **Mobile Sidebar**: The current sidebar is hidden on mobile (`hidden lg:flex`). Ensure the mobile `Navbar` provides access to these new sections.
- **State Management**: If "Tokens" becomes a real feature, integrate with a state manager or context.
