import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

def render_romantic_tree():
    width, height = 1600, 1100
    img = Image.new('RGBA', (width, height), (13, 7, 20, 255))
    draw = ImageDraw.Draw(img)

    # 1. Midnight Wine & Twilight Sky Gradient
    for y in range(height):
        ratio = y / height
        # Gradient from deep dark purple #0c0512 to midnight wine #220c1e
        r = int(12 + ratio * 28)
        g = int(5 + ratio * 12)
        b = int(18 + ratio * 20)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))

    # 2. Celestial Nebulae & Moonlight Glow
    nebula = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    n_draw = ImageDraw.Draw(nebula)
    # Heart-shaped aura behind the tree canopy
    n_draw.ellipse([width * 0.15, height * 0.08, width * 0.85, height * 0.72], fill=(225, 29, 72, 40))
    n_draw.ellipse([width * 0.25, height * 0.12, width * 0.75, height * 0.62], fill=(244, 63, 94, 55))
    n_draw.ellipse([width * 0.32, height * 0.18, width * 0.68, height * 0.52], fill=(251, 191, 36, 45))
    nebula = nebula.filter(ImageFilter.GaussianBlur(95))
    img = Image.alpha_composite(img, nebula)
    draw = ImageDraw.Draw(img)

    # 3. Twinkling Stars & Distant Star Clusters
    random.seed(20261221)
    for _ in range(260):
        sx = random.randint(0, width)
        sy = random.randint(0, int(height * 0.75))
        size = random.choice([1, 1, 1, 2, 2, 3])
        brightness = random.randint(160, 255)
        alpha = random.randint(120, 240)
        draw.ellipse([sx, sy, sx + size, sy + size], fill=(brightness, brightness, int(brightness * 0.85), alpha))
        if size == 3:
            # 4-point star flare
            draw.line([(sx - 3, sy + 1), (sx + 5, sy + 1)], fill=(255, 255, 230, 160))
            draw.line([(sx + 1, sy - 3), (sx + 1, sy + 5)], fill=(255, 255, 230, 160))

    # 4. Ground Meadow with Ethereal Moonlit Grass & Mist
    ground = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(ground)
    # Hill mound
    g_draw.ellipse([-width * 0.1, height * 0.82, width * 1.1, height * 1.3], fill=(26, 10, 20, 255))
    g_draw.ellipse([width * 0.1, height * 0.86, width * 0.9, height * 1.25], fill=(38, 14, 28, 255))
    g_draw.ellipse([width * 0.25, height * 0.89, width * 0.75, height * 1.2], fill=(48, 18, 34, 255))
    # Ethereal mist over roots
    g_draw.ellipse([width * 0.15, height * 0.80, width * 0.85, height * 0.98], fill=(244, 63, 94, 30))
    g_draw.ellipse([width * 0.25, height * 0.82, width * 0.75, height * 0.95], fill=(251, 191, 36, 25))
    ground = ground.filter(ImageFilter.GaussianBlur(15))
    img = Image.alpha_composite(img, ground)
    draw = ImageDraw.Draw(img)

    # 5. Tree Trunk and Organic Fractal Branches
    trunk_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(trunk_layer)

    def draw_organic_branch(x0, y0, length, angle, thickness, depth):
        if depth <= 0 or thickness < 1.5:
            return
        rad = math.radians(angle)
        # Curve slightly
        curve = random.uniform(-4, 4)
        x1 = x0 + length * math.cos(rad)
        y1 = y0 - length * math.sin(rad)

        # Bark color: rich deep mahogany rosewood with subtle highlight
        shade = max(20, min(65, int(35 + (depth * 5))))
        color = (shade + 20, max(8, shade - 15), max(12, shade - 5), 255)
        t_draw.line([(x0, y0), (x1, y1)], fill=color, width=int(thickness))

        # Branch splits
        if depth > 1:
            num_splits = random.choice([2, 3])
            spread = random.uniform(22, 36)
            for s in range(num_splits):
                offset = (s - (num_splits - 1) / 2) * spread + random.uniform(-6, 6)
                next_len = length * random.uniform(0.72, 0.86)
                next_thick = thickness * random.uniform(0.65, 0.75)
                draw_organic_branch(x1, y1, next_len, angle + offset + curve, next_thick, depth - 1)

    # Ancient Majestic Gnarled Trunk
    trunk_base_x = width * 0.5
    trunk_base_y = height * 0.92

    # Draw massive roots spreading outwards
    roots = [
        (-140, 45, 160, 205, 32),
        (-90, 30, 180, 230, 38),
        (-40, 15, 190, 255, 42),
        (40, 15, 190, 285, 42),
        (90, 30, 180, 310, 38),
        (140, 45, 160, 335, 32),
        (-220, 60, 130, 195, 24),
        (220, 60, 130, 345, 24),
    ]
    for rx, ry, rlen, rang, rth in roots:
        draw_organic_branch(trunk_base_x + rx, trunk_base_y - 20, rlen, rang, rth, 3)

    # Main Sturdy Trunk Pillar (Polygonal gnarled structure)
    trunk_points = [
        (trunk_base_x - 110, trunk_base_y),
        (trunk_base_x - 90, trunk_base_y - 100),
        (trunk_base_x - 80, trunk_base_y - 200),
        (trunk_base_x - 65, trunk_base_y - 320),
        (trunk_base_x - 120, trunk_base_y - 420), # left bough
        (trunk_base_x - 40, trunk_base_y - 420),
        (trunk_base_x, trunk_base_y - 460),      # center bough
        (trunk_base_x + 40, trunk_base_y - 420),
        (trunk_base_x + 120, trunk_base_y - 420), # right bough
        (trunk_base_x + 65, trunk_base_y - 320),
        (trunk_base_x + 80, trunk_base_y - 200),
        (trunk_base_x + 90, trunk_base_y - 100),
        (trunk_base_x + 110, trunk_base_y),
    ]
    t_draw.polygon(trunk_points, fill=(42, 16, 24, 255))

    # Bark ridges and texture lines
    for i in range(-5, 6):
        bx = trunk_base_x + i * 14
        t_draw.line([(bx, trunk_base_y), (bx * 0.98 + width * 0.01, trunk_base_y - 300)], fill=(60, 24, 34, 180), width=3)
        t_draw.line([(bx + 4, trunk_base_y - 40), (bx * 0.99 + width * 0.005, trunk_base_y - 280)], fill=(28, 10, 16, 200), width=2)

    # Major Canopy Boughs
    boughs = [
        (trunk_base_x - 80, trunk_base_y - 380, 220, 145, 34, 5),
        (trunk_base_x - 50, trunk_base_y - 410, 250, 125, 36, 5),
        (trunk_base_x - 20, trunk_base_y - 440, 280, 105, 38, 5),
        (trunk_base_x + 10, trunk_base_y - 450, 290, 85, 38, 5),
        (trunk_base_x + 40, trunk_base_y - 430, 270, 65, 36, 5),
        (trunk_base_x + 80, trunk_base_y - 390, 230, 40, 34, 5),
        (trunk_base_x - 110, trunk_base_y - 330, 180, 165, 28, 4),
        (trunk_base_x + 110, trunk_base_y - 330, 180, 20, 28, 4),
    ]
    for bx, by, blen, bang, bth, bdep in boughs:
        draw_organic_branch(bx, by, blen, bang, bth, bdep)

    # Carved Golden Heart with "V + T" on Trunk
    heart_cx = trunk_base_x
    heart_cy = trunk_base_y - 180
    # Soft glow around carved heart
    for r in range(40, 10, -5):
        t_draw.ellipse([heart_cx - r, heart_cy - r, heart_cx + r, heart_cy + r], fill=(223, 188, 120, 12))
    
    # Carved Heart Outline
    heart_pts = []
    for deg in range(0, 360, 10):
        t = math.radians(deg)
        # Heart formula
        hx = 28 * (math.sin(t) ** 3)
        hy = - (24 * math.cos(t) - 9 * math.cos(2*t) - 4 * math.cos(3*t) - 2 * math.cos(4*t))
        heart_pts.append((heart_cx + hx, heart_cy + hy))
    t_draw.polygon(heart_pts, fill=(65, 22, 32, 255), outline=(223, 188, 120, 255))
    
    img = Image.alpha_composite(img, trunk_layer)
    draw = ImageDraw.Draw(img)

    # 6. Cascading Weeping Cherry & Rose-Gold Blossoms Canopy
    blossom_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(blossom_layer)

    # Canopy Bloom Clusters (Thousands of glowing romantic petals)
    palette = [
        (255, 182, 193, 210), # Light pink
        (255, 105, 180, 190), # Hot pink
        (244, 63, 94, 200),   # Rose
        (251, 113, 133, 180), # Coral rose
        (253, 164, 175, 170), # Soft blush
        (223, 188, 120, 180), # Rose gold
        (254, 240, 138, 190), # Warm gold sparkle
    ]

    # Generate major floral cloud centers
    canopy_centers = [
        (trunk_base_x, height * 0.28, 280),
        (trunk_base_x - 220, height * 0.32, 250),
        (trunk_base_x + 220, height * 0.32, 250),
        (trunk_base_x - 380, height * 0.40, 220),
        (trunk_base_x + 380, height * 0.40, 220),
        (trunk_base_x - 480, height * 0.48, 180),
        (trunk_base_x + 480, height * 0.48, 180),
        (trunk_base_x - 120, height * 0.20, 210),
        (trunk_base_x + 120, height * 0.20, 210),
    ]

    for cx, cy, radius in canopy_centers:
        for _ in range(320):
            ang = random.uniform(0, math.pi * 2)
            dist = random.gauss(0, radius * 0.5)
            px = cx + math.cos(ang) * dist
            py = cy + math.sin(ang) * dist
            psize = random.randint(5, 14)
            color = random.choice(palette)
            b_draw.ellipse([px - psize, py - psize, px + psize, py + psize], fill=color)

    # Weeping cascading wisteria / sakura tendrils hanging down
    for strand in range(110):
        sx = trunk_base_x + random.uniform(-550, 550)
        # Tendrils hang from canopy
        dist_from_center = abs(sx - trunk_base_x) / 550
        sy = height * 0.30 + dist_from_center * 160 + random.uniform(-40, 40)
        strand_len = random.randint(70, 220)
        curr_x, curr_y = sx, sy
        b_draw.line([(curr_x, curr_y), (curr_x, curr_y + 15)], fill=(120, 50, 70, 120), width=1)
        for step in range(0, strand_len, 8):
            curr_x += random.uniform(-3, 3)
            curr_y += 8
            psize = random.randint(4, 9)
            color = random.choice(palette)
            b_draw.ellipse([curr_x - psize, curr_y - psize, curr_x + psize, curr_y + psize], fill=color)

    # Gaussian blur blossom glow
    blossom_glow = blossom_layer.filter(ImageFilter.GaussianBlur(12))
    img = Image.alpha_composite(img, blossom_glow)
    img = Image.alpha_composite(img, blossom_layer)

    # 7. Drifting Fireflies & Luminous Sparkles
    firefly_layer = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    f_draw = ImageDraw.Draw(firefly_layer)
    for _ in range(120):
        fx = random.randint(int(width * 0.1), int(width * 0.9))
        fy = random.randint(int(height * 0.15), int(height * 0.92))
        f_size = random.choice([2, 3, 4, 5])
        # Inner white, outer golden glow
        f_draw.ellipse([fx - f_size * 3, fy - f_size * 3, fx + f_size * 3, fy + f_size * 3], fill=(254, 240, 138, 45))
        f_draw.ellipse([fx - f_size, fy - f_size, fx + f_size, fy + f_size], fill=(255, 255, 255, 230))

    img = Image.alpha_composite(img, firefly_layer)

    # 8. Save high-resolution romantic tree
    final_rgb = img.convert('RGB')
    final_rgb.save('static/images/realistic_tree_of_hearts.jpg', quality=95)
    print("✨ Realistic Tree of Hearts successfully created at static/images/realistic_tree_of_hearts.jpg!")

if __name__ == '__main__':
    render_romantic_tree()

