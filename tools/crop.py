from PIL import Image

try:
    img = Image.open('C:/Users/CTNick/Desktop/kod/targonsecuritysite/images/targon-logo.png')
    width, height = img.size
    # The shield is a square on the left. We crop a square of size `height x height`
    left = 0
    top = 0
    right = height
    bottom = height
    cropped_img = img.crop((left, top, right, bottom))
    cropped_img.save('C:/Users/CTNick/Desktop/kod/targonsecuritysite/images/shield-icon.png')
    print("Cropped successfully to shield-icon.png")
except Exception as e:
    print("Error:", e)
