#!/bin/bash

echo "🔍 COMPREHENSIVE BUG BASH - Q10UX PORTFOLIO"
echo "============================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "PASS") echo -e "${GREEN}✅ PASS${NC}: $message" ;;
        "FAIL") echo -e "${RED}❌ FAIL${NC}: $message" ;;
        "WARN") echo -e "${YELLOW}⚠️  WARN${NC}: $message" ;;
        "INFO") echo -e "${BLUE}ℹ️  INFO${NC}: $message" ;;
    esac
}

echo "📋 CHECKING HTML FILES..."
echo "------------------------"

# Check all HTML files for consistency
html_files=$(find src/ -name "*.html" -type f)
html_count=0
html_issues=0

for file in $html_files; do
    html_count=$((html_count + 1))
    issues=0
    
    # Check for missing DOCTYPE
    if ! grep -q "<!DOCTYPE html>" "$file"; then
        print_status "FAIL" "$file: Missing DOCTYPE declaration"
        issues=$((issues + 1))
    fi
    
    # Check for missing viewport meta tag
    if ! grep -q "viewport" "$file"; then
        print_status "WARN" "$file: Missing viewport meta tag"
        issues=$((issues + 1))
    fi
    
    # Check for missing charset
    if ! grep -q "charset" "$file"; then
        print_status "WARN" "$file: Missing charset declaration"
        issues=$((issues + 1))
    fi
    
    # Check for broken image links
    if grep -q "src=" "$file"; then
        broken_images=$(grep -o 'src="[^"]*"' "$file" | grep -v "data:" | grep -v "http" | while read -r img; do
            img_path=$(echo "$img" | sed 's/src="//' | sed 's/"//')
            if [[ ! -f "$img_path" ]] && [[ ! -f "src/$img_path" ]] && [[ ! -f "public/$img_path" ]]; then
                echo "$img_path"
            fi
        done)
        if [[ -n "$broken_images" ]]; then
            print_status "FAIL" "$file: Broken image links found"
            issues=$((issues + 1))
        fi
    fi
    
    # Check for missing alt attributes on images
    missing_alt=$(grep -c '<img[^>]*>' "$file" 2>/dev/null || echo "0")
    if [[ "$missing_alt" -gt 0 ]]; then
        print_status "WARN" "$file: Images may be missing alt attributes"
        issues=$((issues + 1))
    fi
    
    # Check for proper CSS linking
    if ! grep -q "q10ux.css" "$file"; then
        print_status "WARN" "$file: May be missing Q10UX CSS link"
        issues=$((issues + 1))
    fi
    
    html_issues=$((html_issues + issues))
done

print_status "INFO" "Checked $html_count HTML files with $html_issues total issues"

echo ""
echo "🎨 CHECKING CSS FILES..."
echo "-----------------------"

# Check CSS files for consistency
css_files=$(find src/ -name "*.css" -type f)
css_count=0
css_issues=0

for file in $css_files; do
    css_count=$((css_count + 1))
    issues=0
    
    # Check for missing vendor prefixes
    unprefixed=$(grep -c "border-radius\|box-shadow\|transform\|transition" "$file" 2>/dev/null || echo "0")
    if [[ "$unprefixed" -gt 0 ]]; then
        print_status "WARN" "$file: May need vendor prefixes for older browsers"
        issues=$((issues + 1))
    fi
    
    # Check for accessibility issues
    if grep -q "color: #fff\|color: white" "$file"; then
        print_status "WARN" "$file: White text may have contrast issues"
        issues=$((issues + 1))
    fi
    
    css_issues=$((css_issues + issues))
done

print_status "INFO" "Checked $css_count CSS files with $css_issues total issues"

echo ""
echo "📱 CHECKING RESPONSIVE DESIGN..."
echo "-------------------------------"

# Check for responsive design patterns
responsive_issues=0

# Check main CSS for media queries
if [[ -f "src/styles/q10ux.css" ]]; then
    media_queries=$(grep -c "@media" "src/styles/q10ux.css" 2>/dev/null || echo "0")
    if [[ "$media_queries" -eq 0 ]]; then
        print_status "FAIL" "Main CSS missing responsive media queries"
        responsive_issues=$((responsive_issues + 1))
    else
        print_status "PASS" "Main CSS has $media_queries media queries"
    fi
fi

# Check for viewport meta tags
viewport_count=$(grep -r "viewport" src/ --include="*.html" | wc -l)
if [[ "$viewport_count" -eq 0 ]]; then
    print_status "FAIL" "No viewport meta tags found"
    responsive_issues=$((responsive_issues + 1))
else
    print_status "PASS" "Found $viewport_count viewport meta tags"
fi

echo ""
echo "🔗 CHECKING LINKS AND NAVIGATION..."
echo "-----------------------------------"

# Check for broken internal links
broken_links=0
all_links=$(grep -r 'href="[^"]*"' src/ --include="*.html" | grep -o 'href="[^"]*"' | sed 's/href="//' | sed 's/"//' | sort | uniq)

for link in $all_links; do
    if [[ "$link" != "#" && "$link" != "javascript:"* && "$link" != "mailto:"* && "$link" != "tel:"* && "$link" != "http"* ]]; then
        if [[ ! -f "$link" ]] && [[ ! -f "src/$link" ]] && [[ ! -f "public/$link" ]]; then
            print_status "FAIL" "Broken internal link: $link"
            broken_links=$((broken_links + 1))
        fi
    fi
done

if [[ "$broken_links" -eq 0 ]]; then
    print_status "PASS" "All internal links appear to be valid"
else
    print_status "FAIL" "Found $broken_links broken internal links"
fi

echo ""
echo "📄 CHECKING DOCUMENTATION..."
echo "----------------------------"

# Check for README files
if [[ -f "README.md" ]]; then
    readme_size=$(wc -c < "README.md")
    if [[ "$readme_size" -lt 100 ]]; then
        print_status "WARN" "README.md appears to be very small ($readme_size bytes)"
    else
        print_status "PASS" "README.md exists and has content ($readme_size bytes)"
    fi
else
    print_status "FAIL" "No README.md found"
fi

# Check for deployment instructions
if [[ -f "NETLIFY_DEPLOYMENT.md" ]]; then
    print_status "PASS" "Netlify deployment documentation exists"
else
    print_status "WARN" "No Netlify deployment documentation found"
fi

echo ""
echo "🔧 CHECKING BUILD AND DEPLOYMENT..."
echo "-----------------------------------"

# Check for package.json
if [[ -f "package.json" ]]; then
    print_status "PASS" "package.json exists"
else
    print_status "WARN" "No package.json found"
fi

# Check for netlify.toml
if [[ -f "netlify.toml" ]]; then
    print_status "PASS" "netlify.toml exists"
else
    print_status "WARN" "No netlify.toml found"
fi

# Check for _redirects
if [[ -f "_redirects" ]]; then
    print_status "PASS" "_redirects file exists"
else
    print_status "WARN" "No _redirects file found"
fi

echo ""
echo "📊 SUMMARY"
echo "=========="

total_issues=$((html_issues + css_issues + responsive_issues + broken_links))

if [[ "$total_issues" -eq 0 ]]; then
    print_status "PASS" "🎉 No major issues found! Portfolio is ready for deployment."
else
    print_status "WARN" "Found $total_issues total issues to address before deployment"
fi

echo ""
echo "📝 RECOMMENDATIONS:"
echo "==================="

if [[ "$html_issues" -gt 0 ]]; then
    echo "• Review HTML files for missing DOCTYPE, viewport tags, and broken images"
fi

if [[ "$css_issues" -gt 0 ]]; then
    echo "• Check CSS files for accessibility and vendor prefix issues"
fi

if [[ "$responsive_issues" -gt 0 ]]; then
    echo "• Ensure responsive design is properly implemented"
fi

if [[ "$broken_links" -gt 0 ]]; then
    echo "• Fix broken internal links"
fi

echo ""
echo "🚀 NEXT STEPS:"
echo "=============="
echo "1. Fix any FAIL issues above"
echo "2. Review WARN issues for potential improvements"
echo "3. Test the site locally: python3 -m http.server 8000"
echo "4. Commit changes to Git"
echo "5. Deploy to Netlify"
echo ""
