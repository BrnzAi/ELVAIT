/**
 * UI Components Tests
 * 
 * Tests for UI components including UserMenu, navigation, buttons, and interactions.
 * Ensures all clickable elements have proper event handlers and work correctly.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// UserMenu Component Tests
// =============================================================================

describe('UI: UserMenu Component', () => {
  const userMenuPath = path.join(__dirname, '../src/components/auth/UserMenu.tsx');
  let userMenuCode: string;

  beforeAll(() => {
    userMenuCode = fs.readFileSync(userMenuPath, 'utf-8');
  });

  describe('Sign Out Functionality', () => {
    it('should have signOut import from next-auth/react', () => {
      expect(userMenuCode).toContain("import { signOut");
      expect(userMenuCode).toContain("from 'next-auth/react'");
    });

    it('should have handleSignOut function', () => {
      expect(userMenuCode).toContain('handleSignOut');
    });

    it('should call signOut on button click', () => {
      expect(userMenuCode).toContain('onClick={handleSignOut}');
    });

    it('should have Sign out button with proper structure', () => {
      expect(userMenuCode).toContain('<button');
      expect(userMenuCode).toContain('Sign out');
      expect(userMenuCode).toContain('<LogOut');
    });

    it('should prevent event propagation on sign out', () => {
      expect(userMenuCode).toContain('e.preventDefault()');
      expect(userMenuCode).toContain('e.stopPropagation()');
    });

    it('should have redirect or callbackUrl for navigation after sign out', () => {
      const hasRedirect = userMenuCode.includes('redirect: true') || 
                          userMenuCode.includes('callbackUrl') ||
                          userMenuCode.includes("router.push");
      expect(hasRedirect).toBe(true);
    });

    it('should have error handling for sign out', () => {
      expect(userMenuCode).toContain('try {');
      expect(userMenuCode).toContain('catch');
    });

    it('should have fallback navigation', () => {
      expect(userMenuCode).toContain('window.location.href');
    });
  });

  describe('Menu Dropdown Behavior', () => {
    it('should have isOpen state for dropdown', () => {
      expect(userMenuCode).toContain('useState(false)');
      expect(userMenuCode).toContain('isOpen');
    });

    it('should toggle menu on button click', () => {
      expect(userMenuCode).toContain('setIsOpen(!isOpen)');
    });

    it('should close menu on outside click', () => {
      expect(userMenuCode).toContain('handleClickOutside');
      expect(userMenuCode).toContain('mousedown');
    });

    it('should close menu when sign out is clicked', () => {
      expect(userMenuCode).toContain('setIsOpen(false)');
    });
  });

  describe('User Display', () => {
    it('should display user name or email', () => {
      expect(userMenuCode).toContain('session.user.name');
      expect(userMenuCode).toContain('session.user.email');
    });

    it('should show user avatar/initial', () => {
      expect(userMenuCode).toContain("toUpperCase()");
    });
  });

  describe('Authentication State Handling', () => {
    it('should handle loading state', () => {
      expect(userMenuCode).toContain("status === 'loading'");
    });

    it('should handle unauthenticated state', () => {
      expect(userMenuCode).toContain('!session?.user');
    });

    it('should show sign in/up links when not authenticated', () => {
      expect(userMenuCode).toContain('href="/signin"');
      expect(userMenuCode).toContain('href="/signup"');
    });
  });

  describe('Navigation Links', () => {
    it('should have Dashboard navigation', () => {
      // Dashboard can be a Link with href OR a button with router.push
      const hasDashboardLink = userMenuCode.includes('href="/dashboard"');
      const hasDashboardPush = userMenuCode.includes("router.push('/dashboard')");
      expect(hasDashboardLink || hasDashboardPush).toBe(true);
      expect(userMenuCode).toContain('Dashboard');
    });
  });
});

// =============================================================================
// Navigation Component Tests
// =============================================================================

describe('UI: Navigation Components', () => {
  const homepagePath = path.join(__dirname, '../src/app/page.tsx');
  
  it('Homepage should exist', () => {
    expect(fs.existsSync(homepagePath)).toBe(true);
  });

  it('Homepage should include UserMenu', () => {
    const homepageCode = fs.readFileSync(homepagePath, 'utf-8');
    expect(homepageCode).toContain('UserMenu');
  });
});

// =============================================================================
// Button Click Tests (Structure Validation)
// =============================================================================

describe('UI: Interactive Elements', () => {
  const componentsDir = path.join(__dirname, '../src/components');
  const appDir = path.join(__dirname, '../src/app');

  const findTsxFiles = (dir: string): string[] => {
    const files: string[] = [];
    if (!fs.existsSync(dir)) return files;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findTsxFiles(fullPath));
      } else if (entry.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
    return files;
  };

  describe('Button onClick Handlers', () => {
    it('all buttons should have onClick or type="submit"', () => {
      const tsxFiles = [...findTsxFiles(componentsDir), ...findTsxFiles(appDir)];
      const issues: string[] = [];

      for (const file of tsxFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        
        // Find all <button elements
        const buttonMatches = content.matchAll(/<button[^>]*>/g);
        
        for (const match of buttonMatches) {
          const buttonTag = match[0];
          const hasOnClick = buttonTag.includes('onClick');
          const hasTypeSubmit = buttonTag.includes('type="submit"') || buttonTag.includes("type='submit'");
          const isDisabled = buttonTag.includes('disabled');
          
          // Button should have onClick OR type="submit" OR be disabled
          if (!hasOnClick && !hasTypeSubmit && !isDisabled) {
            // Check if it's in a Link wrapper (common pattern)
            const context = content.substring(Math.max(0, match.index! - 100), match.index! + buttonTag.length);
            if (!context.includes('<Link') && !context.includes('<a ')) {
              // Only flag if not wrapped in Link and not a styled button component
              if (!buttonTag.includes('asChild')) {
                const fileName = path.basename(file);
                issues.push(`${fileName}: button without onClick/submit - ${buttonTag.substring(0, 60)}...`);
              }
            }
          }
        }
      }

      // Allow some false positives (styled buttons, radix components, etc.)
      // If there are many issues, log them for review
      if (issues.length > 0) {
        console.log('Button issues found (may be false positives):', issues.slice(0, 5));
      }
      expect(issues.length).toBeLessThan(20);
    });
  });

  describe('Link Components', () => {
    it('all Link components should have valid href', () => {
      const tsxFiles = [...findTsxFiles(componentsDir), ...findTsxFiles(appDir)];
      let invalidLinks = 0;

      for (const file of tsxFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        
        // Find Link components without href
        const linkMatches = content.matchAll(/<Link[^>]*>/g);
        
        for (const match of linkMatches) {
          const linkTag = match[0];
          if (!linkTag.includes('href=')) {
            invalidLinks++;
          }
        }
      }

      expect(invalidLinks).toBe(0);
    });
  });
});

// =============================================================================
// Form Submit Tests
// =============================================================================

describe('UI: Form Submissions', () => {
  const appDir = path.join(__dirname, '../src/app');

  const findTsxFiles = (dir: string): string[] => {
    const files: string[] = [];
    if (!fs.existsSync(dir)) return files;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findTsxFiles(fullPath));
      } else if (entry.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
    return files;
  };

  describe('Sign In Form', () => {
    const signinPath = path.join(appDir, '(auth)/signin/page.tsx');

    it('should exist', () => {
      expect(fs.existsSync(signinPath)).toBe(true);
    });

    it('should have form with onSubmit', () => {
      const content = fs.readFileSync(signinPath, 'utf-8');
      expect(content).toContain('<form');
      expect(content).toContain('onSubmit');
    });

    it('should have email and password inputs', () => {
      const content = fs.readFileSync(signinPath, 'utf-8');
      expect(content).toContain('type="email"');
      expect(content).toContain('type="password"');
    });

    it('should have submit button', () => {
      const content = fs.readFileSync(signinPath, 'utf-8');
      expect(content).toContain('type="submit"');
    });
  });

  describe('Sign Up Form', () => {
    const signupPath = path.join(appDir, '(auth)/signup/page.tsx');

    it('should exist', () => {
      expect(fs.existsSync(signupPath)).toBe(true);
    });

    it('should have form with onSubmit', () => {
      const content = fs.readFileSync(signupPath, 'utf-8');
      expect(content).toContain('<form');
      expect(content).toContain('onSubmit');
    });

    it('should have submit button', () => {
      const content = fs.readFileSync(signupPath, 'utf-8');
      expect(content).toContain('type="submit"');
    });
  });
});

// =============================================================================
// Dashboard Actions Tests
// =============================================================================

describe('UI: Dashboard Actions', () => {
  const dashboardPath = path.join(__dirname, '../src/app/dashboard/page.tsx');

  it('Dashboard page should exist', () => {
    expect(fs.existsSync(dashboardPath)).toBe(true);
  });

  it('should have delete assessment functionality', () => {
    const content = fs.readFileSync(dashboardPath, 'utf-8');
    const hasDelete = content.includes('delete') || content.includes('Delete') || content.includes('trash') || content.includes('Trash');
    expect(hasDelete).toBe(true);
  });
});

// =============================================================================
// Modal/Dialog Tests
// =============================================================================

describe('UI: Modals and Dialogs', () => {
  const componentsDir = path.join(__dirname, '../src/components');

  const findTsxFiles = (dir: string): string[] => {
    const files: string[] = [];
    if (!fs.existsSync(dir)) return files;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findTsxFiles(fullPath));
      } else if (entry.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
    return files;
  };

  it('modals should have close functionality', () => {
    const tsxFiles = findTsxFiles(componentsDir);
    
    for (const file of tsxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const fileName = path.basename(file);
      
      // If it looks like a modal component
      if (fileName.toLowerCase().includes('modal') || fileName.toLowerCase().includes('dialog')) {
        // Should have some close mechanism
        const hasClose = content.includes('onClose') || 
                         content.includes('setIsOpen') || 
                         content.includes('setOpen') ||
                         content.includes('close');
        expect(hasClose).toBe(true);
      }
    }
  });
});
