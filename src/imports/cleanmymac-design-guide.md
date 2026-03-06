Figma UI Design Guide
CleanMyMac Clone — Complete Screen & Component Specs
Design System · All 10 Module Screens · Component Library · Interactions
Target App	macOS Desktop App
Canvas Size	1280 × 800 px (min) to 1440 × 900 px
Grid	8px base grid, 24px gutter
Total Screens	42 screens across 10 modules
Design Theme	Dark mode primary, Light mode secondary
 1. Design System Foundations
1.1 Color Palette
Set up these colors as Figma Color Styles in your Design System file before building any screens.

Category	Color Name	Hex Value
Primary	Brand Blue	#1A6B9A
Primary	Brand Green (CTA)	#2E9C6A
Primary	Background Dark	#0F1B26
Primary	Background Dark 2 (sidebar)	#152230
Primary	Surface Dark (cards)	#1C2E3E
Primary	Surface Dark Hover	#223549
Text	Text Primary (on dark)	#FFFFFF
Text	Text Secondary	#8BA8BE
Text	Text Disabled	#4A6070
Accent	Danger / Threat Red	#E05252
Accent	Warning Orange	#E07A30
Accent	Success Green	#3CB875
Accent	Info Blue	#4DA6D8
Accent	Purple (Assistant)	#7B52C8
Light Mode	BG Light	#F0F4F8
Light Mode	Surface Light	#FFFFFF
Light Mode	Surface Light 2	#E8EFF5
Light Mode	Text Light Primary	#1A2B38

1.2 Typography
Use SF Pro Display (system font on macOS). Set as Text Styles in Figma.

Style Name	Font / Size / Weight	Usage
Display / Hero	SF Pro Display, 40px, Bold	Welcome screen title, scan complete hero
Heading 1	SF Pro Display, 28px, Semibold	Module title at top of each screen
Heading 2	SF Pro Display, 20px, Semibold	Section headers within a module
Heading 3	SF Pro Text, 16px, Semibold	Card titles, group labels
Body Large	SF Pro Text, 15px, Regular	Primary body text, descriptions
Body Default	SF Pro Text, 13px, Regular	Secondary descriptions, labels
Body Small	SF Pro Text, 11px, Regular	Metadata, timestamps, file paths
Mono	SF Mono, 12px, Regular	File paths, byte sizes, code snippets
Label Badge	SF Pro Text, 11px, Bold, ALL CAPS	Status badges, tag labels
Number Hero	SF Pro Display, 48px, Bold	Scan result numbers (e.g. 5.5 GB)

1.3 Spacing & Grid
Token	Value
--space-2	2px — micro gaps within components
--space-4	4px — icon-to-label gap
--space-8	8px — base unit, list item internal padding
--space-12	12px — compact card padding
--space-16	16px — standard card padding, list row height add-on
--space-24	24px — section gutter, sidebar padding
--space-32	32px — major section separation
--space-48	48px — hero area padding
Border Radius S	6px — small chips, badges
Border Radius M	10px — cards, panels, buttons
Border Radius L	16px — modal dialogs, large cards
Border Radius XL	24px — hero illustration containers

1.4 Shadows & Effects
Effect	Figma Value
Card Shadow	X:0 Y:4 Blur:16 Spread:0 Color:#00000040
Card Shadow Hover	X:0 Y:8 Blur:24 Spread:-2 Color:#00000060
Modal Overlay	X:0 Y:20 Blur:60 Spread:0 Color:#00000080
Sidebar Shadow	X:4 Y:0 Blur:20 Spread:0 Color:#0000003A
Button Glow (CTA)	X:0 Y:0 Blur:16 Spread:2 Color:#2E9C6A50
Threat Glow (danger)	X:0 Y:0 Blur:16 Spread:2 Color:#E0525240
 2. Component Library
Create the following components in a dedicated 'Components' Figma page before building screens. Use Auto Layout and Variants throughout.

2.1 Core Components
COMPONENT: Sidebar Navigation

•	Size: 220px wide × full height (800px)
•	Background: #152230 with 4px right border #1A6B9A
•	Top section: App logo + name (40px height)
•	Navigation items list: icon (20×20) + label (Body Default) + active indicator (3px left border, brand green)
•	Active state: item background #1A6B9A20, text color #FFFFFF, icon tint #2E9C6A
•	Hover state: background #FFFFFF08
•	Bottom section: User avatar + subscription badge + settings icon
•	Variants: Default / Active / Hover for each nav item
•	Nav items (in order): Smart Care, Cleanup, Protection, Performance, Applications, My Clutter, Space Lens, Cloud Cleanup, Assistant

COMPONENT: Module Header

•	Size: Full width of content area × 80px
•	Left: Module icon (32×32, colored) + Module title (Heading 1) + subtitle (Body Default, #8BA8BE)
•	Right: Primary CTA button (Scan / Start) + secondary button (Settings)
•	Bottom border: 1px solid #1A6B9A30
•	Variants: Default / Scanning (pulse animation placeholder) / Complete

COMPONENT: Scan Result Card

•	Size: Variable width × 120px
•	Background: #1C2E3E, border-radius: 10px, shadow: Card Shadow
•	Left: Category icon (24×24) + category name (Heading 3) + file count (Body Small, muted)
•	Center: File list preview (max 3 items, mono font, truncated paths)
•	Right: Total size (Number Hero style, brand green) + checkbox (selected by default)
•	States: Default / Selected / Deselected / Scanning (skeleton shimmer) / Empty

COMPONENT: Progress Bar

•	Height: 6px, border-radius: 3px
•	Track: #FFFFFF15
•	Fill: gradient from #1A6B9A to #2E9C6A
•	Animated fill variant: show shimmer overlay for scanning state
•	Label above-right: percentage text (Body Small)
•	Variants: Scanning / Complete / Error (fill color #E05252)

COMPONENT: Primary Button

•	Height: 40px, padding: 0 24px, border-radius: 10px
•	Default: Background #2E9C6A, text white, Heading 3 weight
•	Hover: Background #35B57A, Button Glow shadow effect
•	Pressed: Background #247A55, scale 98%
•	Disabled: Background #FFFFFF15, text #FFFFFF40
•	Destructive variant: Background #E05252, hover #F06262
•	Variants: Default / Hover / Pressed / Disabled / Destructive / Loading (spinner)

COMPONENT: Secondary Button

•	Height: 40px, padding: 0 20px, border-radius: 10px
•	Default: Background transparent, border 1px #1A6B9A, text #4DA6D8
•	Hover: Background #1A6B9A15
•	Variants: Default / Hover / Pressed / Disabled

COMPONENT: Threat Badge

•	Height: 22px, padding: 0 8px, border-radius: 6px
•	Critical: Background #E0525220, text #E05252, border 1px #E0525240
•	Warning: Background #E07A3020, text #E07A30, border 1px #E07A3040
•	Clean: Background #3CB87520, text #3CB875, border 1px #3CB87540
•	Variants per severity: Critical / High / Medium / Low / Clean

COMPONENT: Metric Widget (Menu Bar style)

•	Size: 160 × 100px, background: #1C2E3E, border-radius: 10px
•	Top: Icon (16×16) + label (Body Small, muted) + live value (Heading 2, white)
•	Bottom: Sparkline chart (60px height) using stroke path in brand blue
•	Variants: CPU / RAM / Disk / Battery / Network (each with its own icon + color accent)

COMPONENT: File List Row

•	Height: 48px, full width, 16px horizontal padding
•	Left: File type icon (20×20) + filename (Body Large, white) + file path (Body Small, muted, mono font)
•	Right: File size (Body Default, brand blue) + checkbox
•	Hover: Background #FFFFFF06
•	Selected: Left border 3px brand green, background #2E9C6A08
•	Variants: Default / Hover / Selected / Unselectable (locked)

COMPONENT: Circular Progress Indicator

•	Size: 160×160px (large) or 80×80px (small)
•	Background ring: stroke 8px, color #FFFFFF10
•	Progress ring: stroke 8px, gradient #1A6B9A → #2E9C6A, stroke-linecap: round
•	Center: Large percentage or status icon
•	Use for: Smart Care overall progress, Health Score, Protection scan completion
 3. Screen-by-Screen Specifications
3.1 Onboarding Flow (3 screens)
SCREEN: Welcome / Splash

•	Full window: 1280×800px, background gradient: #0F1B26 → #0A2436
•	Center: App icon (120×120) with subtle drop shadow glow (brand green, blur 40px)
•	App name (Display / Hero, white) + tagline (Heading 2, muted)
•	Below: 3 feature highlight chips in a row (icon + label each, glass-morphism style)
•	Bottom: 'Get Started' primary CTA button (width 240px) centered
•	Background: subtle animated particle/star effect (describe as decorative layer)

SCREEN: Permissions Setup

•	Header: Back arrow + 'Set Up CleanMyMac' (Heading 1)
•	Permission list: 4 rows, each with icon (40×40) + name (Heading 3) + description (Body Default, muted) + 'Allow' button or green checkmark if granted
•	Permissions: Full Disk Access, Accessibility (for some tasks), Notifications, Login Item
•	Bottom: 'Continue' button (disabled until Full Disk Access granted)
•	Progress indicator: step dots (1 of 3, 2 of 3, 3 of 3)

SCREEN: First Scan Prompt

•	Illustration area (top 40%): abstract 3D sphere / orb animation placeholder with glow
•	Below: 'Let's see what your Mac is hiding' (Heading 1, centered)
•	Stats preview: 3 cards in row — 'Avg first scan: 5.5 GB', '29M downloads', '4.9 rating'
•	'Run Smart Care' primary button + 'Skip for now' text link
 3.2 Main App Shell
SCREEN: App Shell / Layout

•	Overall layout: Sidebar (220px) + Content area (remaining width) + optional right panel (280px for details)
•	Content area top: Module Header component
•	Content area body: scrollable, 24px padding all sides
•	Menu bar icon: separate 22×22px icon in system status bar (design separately)
•	Window chrome: standard macOS traffic-light buttons (red/yellow/green) at top-left — use native macOS window component representation

3.3 Smart Care Module (5 screens)
SCREEN: Smart Care — Welcome

•	Hero area: large 3D animated orb/sphere illustration (300×300px placeholder), centered top
•	Health score ring below orb: Circular Progress Indicator (160px), score 0–100 inside
•	Health label: 'Excellent / Good / Needs Attention / Critical' badge below ring
•	'Run Smart Care' primary CTA (240px wide, centered)
•	Last scan date (Body Small, muted) below CTA
•	Stats row: 3 mini-cards — Junk Found / Threats / Performance Score

SCREEN: Smart Care — Scanning

•	Top: Overall Progress Bar (full width) + percentage + estimated time remaining
•	5 task tiles in 2-column grid (2+3 layout):
◦	Each tile: 200px tall, rounded card, module icon + name + 'Scanning...' or checkmark
◦	Active tile: pulsing ring animation, progress percentage inside
◦	Completed tile: green checkmark + result summary (e.g. '2.3 GB found')
•	'Cancel Scan' secondary button, bottom right

SCREEN: Smart Care — Results Dashboard

•	Top summary: '5.5 GB can be cleaned' in Number Hero style + sub-label
•	5 result tiles in grid (same 2-column layout):
◦	Each tile: Scan Result Card component, checkbox in top-left corner
◦	Tile types: Cleanup (blue), Protection (orange/red), Performance (purple), Apps (teal), Clutter (yellow)
•	Bottom action bar: sticky, shows 'Clean X GB' primary button + 'Review Details' secondary
•	'Select All / Deselect All' toggle top-right

SCREEN: Smart Care — Cleaning Progress

•	Full-screen overlay: background dimmed
•	Center card: Circular Progress (160px) + animated particle burst effect
•	Below: 'Cleaning...' label + current item being deleted (mono font, truncated path)
•	Progress bar below the card

SCREEN: Smart Care — Complete

•	Celebration moment: confetti/particle burst animation placeholder
•	Large number: 'X GB Freed' in Number Hero style, brand green
•	4 stats cards below: Junk Removed / Threats Removed / Apps Updated / Duplicates Removed
•	'Done' primary button + 'View Details' secondary
 3.4 Cleanup Module (3 screens)
SCREEN: Cleanup — Overview

•	Left panel (60%): Category list with checkboxes (System Junk, User Cache, Logs, Mail Attachments, Language Files, Trash, Xcode Junk, etc.)
◦	Each category row: icon + name (Heading 3) + description (Body Small, muted) + size badge (after scan)
•	Right panel (40%): Info card explaining what will be deleted for selected category
•	'Scan' CTA button, full width at bottom

SCREEN: Cleanup — Scan Results

•	Left panel: Category list, now showing sizes next to each item — green = safe, yellow = review
•	Right panel: File list for selected category using File List Row component, sortable by Name/Size/Date
•	Bottom action bar: 'X items selected — Y GB' + 'Clean' primary button + 'Ignore Selected' link
•	Header shows total: 'Total Found: X.X GB' in brand green

SCREEN: Cleanup — Ignore List

•	Settings sub-panel showing items added to the ignore list
•	Each row: path + app name + 'Remove from Ignore List' X button
•	Empty state: illustration + 'No ignored items yet' label
 3.5 Protection Module (4 screens)
SCREEN: Protection — Overview

•	Status hero: Large shield icon (80×80) with color indicating status: green (protected) / red (threats found) / yellow (scan needed)
•	Status label: 'Mac Protected' / 'Threats Detected' / 'Scan Recommended' (Heading 1)
•	Last scan date + next scheduled scan (Body Default, muted)
•	Scan type selector: 3 segmented control options — Quick / Normal / Deep with time estimate labels
•	'Scan Now' primary CTA button
•	Below: Privacy Tools section header + 3 tool cards: Browser Data / Recent Items / App Permissions

SCREEN: Protection — Scanning

•	Animated radar/sonar circle effect (300px) representing real-time scanning
•	Center of radar: Circular Progress Indicator
•	Below radar: current file being scanned (mono font, scrolling)
•	Stats row: Files Scanned / Threats Found / Time Elapsed
•	'Stop Scan' secondary button

SCREEN: Protection — Threat Found

•	Alert banner at top: red background + warning icon + 'X Threats Detected' (Heading 1, white)
•	Threat list: each row shows: malware name (Heading 3, red) + file path (mono, muted) + threat type badge + severity badge + checkbox
•	Right panel (when row selected): Threat detail card — description, risk level, recommended action (Quarantine / Delete / Ignore)
•	Bottom action bar: 'Quarantine All' primary destructive button + 'Review One by One' secondary

SCREEN: Protection — App Permissions

•	Permissions grouped by type: Camera, Microphone, Location, Contacts, Calendar, Full Disk Access, etc.
•	Each group: collapsible section header with count badge
•	Each app row: app icon (16×16) + app name (Body Large) + permission toggle (macOS-style toggle)
•	Warning indicator on apps with 'many permissions' (> 5 granted)
 3.6 Performance Module (2 screens)
SCREEN: Performance — Overview

•	Top: 3 metric widgets in row — CPU % / RAM Used / Disk Free — using Metric Widget component
◦	Each widget: mini sparkline history chart (last 60s)
•	Process table below: Top CPU consumers, sortable, with Force Quit button per row
•	Bottom section: Maintenance Tasks list — each row has task name + description + 'Run' button + last run date
•	Tasks include: Run Maintenance Scripts, Flush DNS, Rebuild Spotlight, Rebuild Mail Index, Free Purgeable Space

SCREEN: Performance — RAM Freed

•	Success overlay card: 'X MB Freed' in large green number
•	Before/After RAM bar chart (horizontal, two bars)
•	'Done' button
 3.7 Applications Module (3 screens)
SCREEN: Applications — App List

•	Top tabs: 'Installed Apps' | 'App Updater' — use segmented control component
•	Search bar (full width, 40px height, rounded, placeholder 'Search apps...')
•	Filter chips row: All / Recently Used / Unused / Large Apps — horizontal scroll
•	App list: each row uses 48px height — app icon (32×32) + name (Body Large) + version (Body Small, muted) + install date + size badge + 'Uninstall' secondary button
•	Selected row expands (Auto Layout expand) to show leftover files found below it

SCREEN: Applications — Uninstall Confirmation

•	Modal dialog (480×360px): warning icon + app name + 'This will remove X files'
•	Leftover file list: scrollable, max 6 items visible, each with checkbox (all selected by default)
•	Bottom: 'Uninstall + Clean X Files' red primary button + 'Cancel' secondary

SCREEN: Applications — App Updater

•	'X apps have updates available' summary header
•	Update list: app icon + name + current version → new version (arrow) + 'Update' button per row
•	'Update All' primary button at top-right
•	Completed row style: grayed out with checkmark
 3.8 My Clutter Module (3 screens)
SCREEN: Clutter — Overview

•	3 scan category cards in row: Duplicates / Similar Photos / Large & Old Files
◦	Each card (300×180px): illustration + title + description + 'Scan' button
•	After scan: card updates to show items found count + size saved potential

SCREEN: Clutter — Duplicates

•	Left: Grouped duplicate sets — each group shows master file + duplicates indented below
•	Master row: file icon + filename (Body Large, bold) + path (mono, muted) + 'Keep' tag
◦	Duplicate rows: same but with 'DELETE' tag (red), checkbox
•	Right: Preview panel — image preview for photos, file info for others
•	Bottom action bar: 'X duplicates selected — Y MB' + 'Remove Duplicates' CTA

SCREEN: Clutter — Similar Photos

•	Grid view: photo cluster groups side by side (3 per row)
•	Each cluster card: thumbnail grid (2×2) + 'X similar photos — Y MB' label + similarity score badge
•	Expanded cluster: full thumbnail grid with per-photo checkboxes + date/size labels
•	Bottom: 'Keep Best, Remove Rest' smart CTA + 'Review Manually' secondary
 3.9 Space Lens Module (2 screens)
SCREEN: Space Lens — Treemap View

•	Full content area: Interactive treemap/bubble visualization
•	Each rectangle/bubble: colored by file type (use legend), sized proportionally to folder size
•	Color legend sidebar (right, 120px): file type → color mapping chips
•	Breadcrumb path bar at top of visualization (e.g. Macintosh HD > Users > username > Library)
•	Hover state: tooltip overlay showing folder name + size + item count
•	Click: drills down into folder (animate zoom-in transition)
•	Toolbar above treemap: Sort by (Size / Name / Date) + View toggle (Bubbles / Squares) + 'Go Up' button
•	Bottom status bar: Drive used / total + disk usage bar

SCREEN: Space Lens — Item Detail

•	Right panel slide-in: 280px wide, dark background
•	Content: folder/file name (Heading 2) + full path (mono, small) + size + date modified + item count
•	Action buttons: 'Open in Finder' + 'Delete' (destructive)
•	Parent folder breadcrumb link at top of panel
 3.10 Cloud Cleanup Module (3 screens)
SCREEN: Cloud — Connect Accounts

•	4 cloud service cards in 2×2 grid: iCloud Drive / Google Drive / OneDrive / Dropbox
•	Each card (280×160px): service logo (48×48) + service name (Heading 2) + storage used/total bar + 'Connect' or 'Connected' status button
•	'Connected' state: green dot + disconnect link in corner

SCREEN: Cloud — Cloud Space Lens

•	Service tabs at top: iCloud / Google Drive / OneDrive / Dropbox
•	Main area: re-use Space Lens treemap for cloud files
•	File type indicator: cloud-only (cloud icon) vs. local copy (download icon)
•	Right panel: action buttons: 'Delete from Cloud' / 'Remove Local Copy' / 'Unsync'

SCREEN: Cloud — Cleanup Complete

•	Summary card: 'X GB freed from cloud' + service breakdown table
•	'Done' CTA + 'View Cloud' secondary
 3.11 Menu Bar Popover (1 design)
SCREEN: Menu Bar Popover

•	Size: 340×420px popover anchored to menu bar icon
•	Top: App logo (small) + 'Mac Health: Excellent' status in green
•	Metrics grid (2×3): 6 Metric Widget components — CPU / RAM / Disk / Battery / Network Down / Network Up
•	Divider line
•	Protection status row: shield icon + 'Protected — Last scan: X days ago'
•	Quick actions row: 'Smart Care' button + 'Scan Now' button
•	Bottom: 'Open CleanMyMac' link
 3.12 AI Assistant / Health Screen (2 screens)
SCREEN: Assistant — Mac Health Dashboard

•	Top: Large Circular Progress (200px) showing health score 0–100 with label
•	Breakdown cards below ring: 4 cards — Disk Health / Security / Performance / Updates
•	Each card: category icon + score bar (colored by score) + label
•	Recommendations list: card-style items with priority badge (High/Medium/Low), action button per item
•	Each recommendation: icon + title (Heading 3) + 1-line description + 'Fix Now' button or 'Dismiss'

SCREEN: Assistant — Smart Insights Panel

•	Triggered when user taps on a system file type in Cleanup or Space Lens
•	Right side-panel (320px wide) slides in
•	Apple Intelligence icon badge at top-right corner of panel
•	Content: file type name (Heading 2) + plain-language explanation (Body Large) + safe-to-delete indicator (yes/no badge) + file size contribution
•	'Add to Ignore List' + 'Delete All' action buttons at bottom
 4. Figma File Structure
Organize your Figma project into these pages:

Figma Page Name	Contents
🎨 Design System	Color styles, text styles, effects styles, spacing tokens — no frames, just styles
🧩 Component Library	All reusable components with variants and auto-layout — Sidebar, Cards, Buttons, Badges, Widgets, etc.
🚀 Onboarding	3 screens: Welcome, Permissions Setup, First Scan Prompt
🏠 Smart Care	5 screens: Welcome, Scanning, Results, Cleaning, Complete
🧹 Cleanup	3 screens: Overview, Scan Results, Ignore List
🛡️ Protection	4 screens: Overview, Scanning, Threat Found, App Permissions
⚡ Performance	2 screens: Overview, RAM Freed
📦 Applications	3 screens: App List, Uninstall Modal, App Updater
🗂️ My Clutter	3 screens: Overview, Duplicates, Similar Photos
🔭 Space Lens	2 screens: Treemap View, Item Detail Panel
☁️ Cloud Cleanup	3 screens: Connect Accounts, Cloud Space Lens, Complete
📊 Menu Bar	1 design: Popover panel
🤖 AI Assistant	2 screens: Health Dashboard, Smart Insights Panel
📐 Flows & Prototyping	Full prototype connections between all screens for all 10 modules
📤 Exports & Handoff	Spec annotations, developer notes, asset exports
 5. Interaction & Animation Specifications
5.1 Page Transitions
Transition	Specification
Sidebar nav click → module	Instant swap, no animation — module content fades in 150ms ease-out
Scan start → scanning state	Module content cross-dissolves 200ms; progress elements slide up from bottom 300ms ease-out
Scan complete → results	Results tiles stagger-fade in: each tile delays 80ms, fade 250ms ease-out
Results → cleaning	Full-screen overlay scales in from center 300ms spring (damping 0.7)
Cleaning → complete	Overlay crossfades to celebration screen 400ms; confetti burst instant
Right panel open	Slides in from right 280ms ease-out cubic-bezier(0.4, 0, 0.2, 1)
Modal dialog	Scales from 95% to 100% + fades 200ms ease-out; overlay fades 200ms
Treemap drill-down	Zoom-in animation: selected tile scales up to fill view, 350ms spring

5.2 Micro-interactions
•	Scan progress: circular ring fills clockwise with stroke-dashoffset animation
•	Metric sparklines: animated draw from left to right on first render (600ms ease-out)
•	Threat badge: pulse glow animation on Critical threats (2s loop, opacity 0.4→1→0.4)
•	Checkbox tick: path draw animation (150ms ease-in-out)
•	Button press: scale(0.97) transform over 80ms + slight shadow reduction
•	Scan radar: rotating conic gradient overlay at 2rpm on scanning screen
•	Health score ring: counts up from 0 to final score over 1200ms ease-out on first load
•	File deletion: row slides out to the left with fade over 200ms
 6. Dark Mode & Light Mode
CleanMyMac uses dark mode as primary. Set up Figma Variables (not just Styles) to support mode switching:

Variable Token	Dark Mode Value	Light Mode Value
--bg-primary	#0F1B26	#F0F4F8
--bg-surface	#1C2E3E	#FFFFFF
--bg-sidebar	#152230	#E8EFF5
--text-primary	#FFFFFF	#1A2B38
--text-secondary	#8BA8BE	#4A6A80
--border-default	#FFFFFF15	#C8D8E8
--fill-brand	#1A6B9A	#1A6B9A
--fill-cta	#2E9C6A	#2E9C6A
--shadow-card	#00000040	#00000018

💡 Figma Variable Setup
Use Figma Variables (not Color Styles) for all semantic tokens above. Create a 'Mode' variable collection with 'Dark' and 'Light' modes. Bind all component fills/strokes to these variables. This allows one-click preview toggling between dark and light theme across all screens.
 7. Prototyping Connections Guide
In the 'Flows & Prototyping' page, connect all screens using Figma's prototype connections:

From Screen	Trigger	To Screen
Onboarding: Welcome	'Get Started' click	Onboarding: Permissions
Onboarding: Permissions	'Continue' click (when granted)	Onboarding: First Scan
Onboarding: First Scan	'Run Smart Care' click	Smart Care: Scanning
Onboarding: First Scan	'Skip' click	Smart Care: Welcome
Smart Care: Welcome	'Run Smart Care' click	Smart Care: Scanning
Smart Care: Scanning	Auto (after 3s delay)	Smart Care: Results
Smart Care: Results	'Clean' click	Smart Care: Cleaning
Smart Care: Cleaning	Auto (after 2s delay)	Smart Care: Complete
Smart Care: Complete	'Done' click	Smart Care: Welcome
Any sidebar item	Click	Respective module overview screen
Cleanup: Overview	'Scan' click	Cleanup: Scan Results
Cleanup: Results file row	Hover	Show File List Row hover state
Protection: Overview	'Scan Now' click	Protection: Scanning
Protection: Scanning	Auto (3s)	Protection: Threat Found
Protection: Threat Found	'Quarantine All' click	Protection: Overview (updated)
Applications: App row	Click	Applications: Expand leftover preview
Applications: 'Uninstall'	Click	Applications: Uninstall Modal
Space Lens: Treemap	Click a block	Space Lens: Detail Panel slide-in
Cloud: Service card	'Connect' click	Cloud: OAuth overlay (placeholder)
Menu Bar icon	Click	Menu Bar: Popover
 8. Developer Handoff Checklist
Before Marking Design Complete
1.	All color styles and variables defined and applied consistently across all screens
2.	All text layers use defined Text Styles — no manual font overrides
3.	All components use Auto Layout — no fixed-position designs
4.	Component variants cover all states: Default / Hover / Active / Disabled / Error / Loading
5.	All icons exported as SVG from the Assets panel — grouped by module
6.	Spacing annotations added on at least one screen per module (use Redline or Figma's built-in Inspect)
7.	Prototype connections tested — full end-to-end flow playable without dead ends
8.	Dark mode and Light mode previewed and verified on all screens
9.	All screens sized correctly at 1280×800px minimum frame size
10.	Accessibility check: minimum 4.5:1 contrast ratio on all text (use Figma's Contrast plugin)
11.	Developer spec notes added as Figma comments on complex interactions
12.	Asset export settings configured: 1x, 2x, 3x PNG for icons; SVG for illustrations

✅ Pro Tip for macOS Design
Install the 'Apple Design Resources — macOS' Figma Community file from Apple's official page. It contains native macOS UI components including window chrome, traffic lights, context menus, and system icons (SF Symbols). Use these for realistic macOS fidelity in your prototype.

— End of Figma UI Design Guide —
