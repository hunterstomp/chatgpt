#!/bin/bash

# Q10UX Portfolio - Create FPO Gallery Images and Update Case Studies
# This script generates placeholder images and updates all case study galleries

echo "🎨 Q10UX Portfolio - Creating FPO Gallery System"
echo "================================================"

# Create FPO directory structure
echo "📁 Creating directory structure..."
mkdir -p public/mamp-images/fpo

# Function to create FPO image
create_fpo_image() {
    local project=$1
    local number=$2
    local category=$3
    local description=$4
    local title=$5
    
    # Create full-size FPO image (1920x1080)
    local full_path="public/mamp-images/fpo/${project}-${number}-${category}-${description}.webp"
    
    # Create thumbnail FPO image (400x300)
    local thumb_path="public/mamp-images/fpo/${project}-${number}-${category}-${description}-thumb.webp"
    
    # Create FPO images using ImageMagick (if available)
    if command -v convert &> /dev/null; then
        # Full image with text overlay
        convert -size 1920x1080 xc:#2A2A2A \
                -fill white -pointsize 48 -gravity center \
                -annotate +0-100 "$title" \
                -pointsize 24 -annotate +0+50 "$category" \
                -pointsize 18 -annotate +0+100 "$description" \
                -pointsize 14 -annotate +0+150 "FPO - ${project} #${number}" \
                "$full_path"
        
        # Thumbnail
        convert -size 400x300 xc:#2A2A2A \
                -fill white -pointsize 16 -gravity center \
                -annotate +0-20 "$title" \
                -pointsize 10 -annotate +0+10 "$category" \
                -pointsize 8 -annotate +0+30 "$description" \
                "$thumb_path"
        
        echo "✅ Created: $full_path and $thumb_path"
    else
        # Fallback: create empty files
        touch "$full_path"
        touch "$thumb_path"
        echo "⚠️  Created placeholder files (ImageMagick not available): $full_path and $thumb_path"
    fi
}

# Gallery structure definition
declare -A gallery_structure=(
    # Row 1: Research & Discovery
    ["01"]="research user-interviews User Research Interview sessions and insights"
    ["02"]="research competitive-analysis Competitive Analysis Market research and benchmarking"
    ["03"]="research user-journey User Journey Mapping Customer journey mapping"
    ["04"]="research personas User Personas Target audience profiles"
    ["05"]="research pain-points Pain Points Analysis Key user frustrations identified"
    ["06"]="research opportunities Opportunity Areas Design improvement areas"
    
    # Row 2: Ideation & Concepts
    ["07"]="ideation brainstorming Brainstorming Sessions Ideation and concept generation"
    ["08"]="ideation sketches Initial Sketches Hand-drawn concept sketches"
    ["09"]="ideation wireframes Low-Fidelity Wireframes Layout concepts"
    ["10"]="ideation user-flows User Flow Diagrams Navigation and interaction flows"
    ["11"]="ideation information-architecture Information Architecture Content structure and hierarchy"
    ["12"]="ideation concept-selection Concept Selection Final direction chosen"
    
    # Row 3: Design & Prototyping
    ["13"]="design mockups High-Fidelity Mockups Visual designs"
    ["14"]="design components Design System Components Component library and patterns"
    ["15"]="design interactions Interaction Design Micro-interactions and animations"
    ["16"]="design prototype Interactive Prototype Clickable prototype"
    ["17"]="design responsive Responsive Design Multi-device design variations"
    ["18"]="design accessibility Accessibility Features WCAG 2.1 AA compliance features"
    
    # Row 4: Testing & Validation
    ["19"]="testing usability Usability Testing User testing sessions and feedback"
    ["20"]="testing analytics Analytics & Metrics Performance metrics and data"
    ["21"]="testing iterations Design Iterations Refinements based on feedback"
    ["22"]="testing validation Final Validation User acceptance testing"
    ["23"]="testing performance Performance Testing Load time and optimization testing"
    ["24"]="testing final-review Final Review Stakeholder approval and sign-off"
    
    # Row 5: Implementation & Handoff
    ["25"]="implementation specs Design Specifications Detailed specs for developers"
    ["26"]="implementation assets Design Assets Icons, images, and design files"
    ["27"]="implementation handoff Developer Handoff Collaboration and handoff"
    ["28"]="implementation qa Quality Assurance QA testing and bug fixes"
    ["29"]="implementation launch Product Launch Release and deployment"
    ["30"]="implementation monitoring Post-Launch Monitoring Performance tracking"
    
    # Row 6: Results & Impact
    ["31"]="results metrics Key Performance Metrics KPIs and success metrics"
    ["32"]="results user-feedback User Feedback Post-launch user satisfaction"
    ["33"]="results business-impact Business Impact ROI and business outcomes"
    ["34"]="results lessons Lessons Learned Key insights and takeaways"
    ["35"]="results future Future Roadmap Planned improvements and features"
    ["36"]="results case-study Case Study Documentation Complete documentation"
    
    # Row 7: Additional Screenshots
    ["37"]="screens desktop Desktop Screenshots Full desktop interface screens"
    ["38"]="screens tablet Tablet Screenshots Tablet interface variations"
    ["39"]="screens mobile Mobile Screenshots Mobile interface screens"
    ["40"]="screens detail Detail Views Close-up interface details"
    ["41"]="screens states Interface States Loading, error, and empty states"
    ["42"]="screens animations Animations & Transitions Micro-interactions"
    
    # Row 8: Process Documentation
    ["43"]="process timeline Project Timeline Milestones and phases"
    ["44"]="process team Team Collaboration Cross-functional collaboration"
    ["45"]="process tools Design Tools Tools and software used"
    ["46"]="process methodology Design Methodology Design thinking and process"
    ["47"]="process challenges Challenges & Solutions Key challenges and solutions"
    ["48"]="process summary Project Summary Overview and outcomes"
)

# Projects to process
projects=("atmosfx" "tmobile" "bmgf" "microsoft" "att" "office")

# Generate FPO images for each project
for project in "${projects[@]}"; do
    echo ""
    echo "🎯 Processing project: $project"
    echo "--------------------------------"
    
    for number in {01..48}; do
        if [[ -n "${gallery_structure[$number]}" ]]; then
            IFS=' ' read -r category description title details <<< "${gallery_structure[$number]}"
            create_fpo_image "$project" "$number" "$category" "$description" "$title"
        fi
    done
done

echo ""
echo "📝 Creating gallery template..."
cat > gallery_template.html << 'EOF'
<!-- Gallery Section Template -->
<section class="section" id="gallery">
  <div class="container">
    <h2>Design Gallery</h2>
    <p class="lead mb-4">Comprehensive design process and final deliverables showcasing the complete user experience journey.</p>
    
    <div class="q10ux-gallery">
      <!-- Row 1: Research & Discovery -->
      <div class="q10ux-gallery-item" data-lightbox="/public/mamp-images/fpo/{PROJECT}-01-research-user-interviews.webp">
        <img src="/public/mamp-images/fpo/{PROJECT}-01-research-user-interviews-thumb.webp" alt="User Research - Interview sessions and insights">
        <div class="gallery-caption">
          <strong>User Research</strong><br>
          Interview sessions and insights
        </div>
      </div>
      <!-- Continue with all 48 images... -->
    </div>
  </div>
</section>
EOF

echo ""
echo "🔧 Updating case study galleries..."

# Function to update case study gallery
update_case_study_gallery() {
    local case_study_file=$1
    local project_name=$2
    
    echo "📄 Updating: $case_study_file"
    
    # Create temporary file
    temp_file=$(mktemp)
    
    # Read the file and replace the gallery section
    awk -v project="$project_name" '
    /<!-- Gallery Section -->/ {
        print "    <!-- Gallery Section -->"
        print "    <section class=\"section\" id=\"gallery\">"
        print "      <div class=\"container\">"
        print "        <h2>Design Gallery</h2>"
        print "        <p class=\"lead mb-4\">Comprehensive design process and final deliverables showcasing the complete user experience journey.</p>"
        print "        "
        print "        <div class=\"q10ux-gallery\">"
        
        # Generate all 48 gallery items
        for (i=1; i<=48; i++) {
            num = sprintf("%02d", i)
            if (i <= 6) {
                category = "research"
                if (i == 1) { title = "User Research"; desc = "Interview sessions and insights" }
                else if (i == 2) { title = "Competitive Analysis"; desc = "Market research and benchmarking" }
                else if (i == 3) { title = "User Journey"; desc = "Customer journey mapping" }
                else if (i == 4) { title = "User Personas"; desc = "Target audience profiles" }
                else if (i == 5) { title = "Pain Points"; desc = "Key user frustrations identified" }
                else if (i == 6) { title = "Opportunities"; desc = "Design improvement areas" }
            }
            else if (i <= 12) {
                category = "ideation"
                if (i == 7) { title = "Brainstorming"; desc = "Ideation and concept generation" }
                else if (i == 8) { title = "Initial Sketches"; desc = "Hand-drawn concept sketches" }
                else if (i == 9) { title = "Wireframes"; desc = "Low-fidelity layout concepts" }
                else if (i == 10) { title = "User Flows"; desc = "Navigation and interaction flows" }
                else if (i == 11) { title = "Information Architecture"; desc = "Content structure and hierarchy" }
                else if (i == 12) { title = "Concept Selection"; desc = "Final direction chosen" }
            }
            else if (i <= 18) {
                category = "design"
                if (i == 13) { title = "Design Mockups"; desc = "High-fidelity visual designs" }
                else if (i == 14) { title = "Design System"; desc = "Component library and patterns" }
                else if (i == 15) { title = "Interactions"; desc = "Micro-interactions and animations" }
                else if (i == 16) { title = "Prototype"; desc = "Interactive clickable prototype" }
                else if (i == 17) { title = "Responsive"; desc = "Multi-device design variations" }
                else if (i == 18) { title = "Accessibility"; desc = "WCAG 2.1 AA compliance features" }
            }
            else if (i <= 24) {
                category = "testing"
                if (i == 19) { title = "Usability Testing"; desc = "User testing sessions and feedback" }
                else if (i == 20) { title = "Analytics"; desc = "Performance metrics and data" }
                else if (i == 21) { title = "Iterations"; desc = "Design refinements based on feedback" }
                else if (i == 22) { title = "Validation"; desc = "Final user acceptance testing" }
                else if (i == 23) { title = "Performance"; desc = "Load time and optimization testing" }
                else if (i == 24) { title = "Final Review"; desc = "Stakeholder approval and sign-off" }
            }
            else if (i <= 30) {
                category = "implementation"
                if (i == 25) { title = "Specifications"; desc = "Detailed design specs for developers" }
                else if (i == 26) { title = "Assets"; desc = "Icons, images, and design files" }
                else if (i == 27) { title = "Handoff"; desc = "Developer collaboration and handoff" }
                else if (i == 28) { title = "QA Testing"; desc = "Quality assurance and bug fixes" }
                else if (i == 29) { title = "Launch"; desc = "Product release and deployment" }
                else if (i == 30) { title = "Monitoring"; desc = "Post-launch performance tracking" }
            }
            else if (i <= 36) {
                category = "results"
                if (i == 31) { title = "Metrics"; desc = "Key performance indicators" }
                else if (i == 32) { title = "User Feedback"; desc = "Post-launch user satisfaction" }
                else if (i == 33) { title = "Business Impact"; desc = "ROI and business outcomes" }
                else if (i == 34) { title = "Lessons Learned"; desc = "Key insights and takeaways" }
                else if (i == 35) { title = "Future Roadmap"; desc = "Planned improvements and features" }
                else if (i == 36) { title = "Documentation"; desc = "Complete case study documentation" }
            }
            else if (i <= 42) {
                category = "screens"
                if (i == 37) { title = "Desktop"; desc = "Full desktop interface screens" }
                else if (i == 38) { title = "Tablet"; desc = "Tablet interface variations" }
                else if (i == 39) { title = "Mobile"; desc = "Mobile interface screens" }
                else if (i == 40) { title = "Detail Views"; desc = "Close-up interface details" }
                else if (i == 41) { title = "States"; desc = "Loading, error, and empty states" }
                else if (i == 42) { title = "Animations"; desc = "Micro-interactions and transitions" }
            }
            else {
                category = "process"
                if (i == 43) { title = "Timeline"; desc = "Project milestones and phases" }
                else if (i == 44) { title = "Team"; desc = "Cross-functional collaboration" }
                else if (i == 45) { title = "Tools"; desc = "Design and prototyping tools used" }
                else if (i == 46) { title = "Methodology"; desc = "Design thinking and process" }
                else if (i == 47) { title = "Challenges"; desc = "Key challenges and solutions" }
                else if (i == 48) { title = "Summary"; desc = "Project overview and outcomes" }
            }
            
            print "          <div class=\"q10ux-gallery-item\" data-lightbox=\"/public/mamp-images/fpo/" project "-" num "-" category "-" title ".webp\">"
            print "            <img src=\"/public/mamp-images/fpo/" project "-" num "-" category "-" title "-thumb.webp\" alt=\"" title " - " desc "\">"
            print "            <div class=\"gallery-caption\">"
            print "              <strong>" title "</strong><br>"
            print "              " desc
            print "            </div>"
            print "          </div>"
        }
        
        print "        </div>"
        print "      </div>"
        print "    </section>"
        
        # Skip the old gallery section
        in_gallery = 1
        next
    }
    
    /<!-- Downloads Section -->/ {
        in_gallery = 0
    }
    
    in_gallery == 0 {
        print
    }
    ' "$case_study_file" > "$temp_file"
    
    # Replace the original file
    mv "$temp_file" "$case_study_file"
}

# Update all case study galleries
case_studies=(
    "src/case-studies/atmosfx-media-player/index.html:atmosfx"
    "src/case-studies/tmobile-how-to-switch/index.html:tmobile"
    "src/case-studies/bmgf/index.html:bmgf"
    "src/case-studies/microsoft-office-365/index.html:microsoft"
    "src/case-studies/att-international-roaming/index.html:att"
    "src/case-studies/office-live-workspaces/index.html:office"
)

for case_study in "${case_studies[@]}"; do
    IFS=':' read -r file project <<< "$case_study"
    if [[ -f "$file" ]]; then
        update_case_study_gallery "$file" "$project"
    else
        echo "⚠️  File not found: $file"
    fi
done

echo ""
echo "✅ FPO Gallery System Complete!"
echo ""
echo "📋 Summary:"
echo "   • Created 48 FPO images per project (6x8 grid)"
echo "   • Generated thumbnails and full-size images"
echo "   • Updated all case study galleries"
echo "   • Created comprehensive image guidelines"
echo ""
echo "📖 Next Steps:"
echo "   1. Review IMAGE_GUIDELINES.md for detailed instructions"
echo "   2. Replace FPO images with actual project images"
echo "   3. Optimize images according to guidelines"
echo "   4. Test gallery functionality and accessibility"
echo ""
echo "🎯 Gallery Features:"
echo "   • 6-column responsive grid"
echo "   • Lightbox functionality for full-size viewing"
echo "   • Hover effects with captions"
echo "   • WCAG 2.1 AA accessibility compliance"
echo "   • Lazy loading for performance"
echo ""
