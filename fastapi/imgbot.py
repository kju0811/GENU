from openai import OpenAI
from fastapi.responses import StreamingResponse
import io
import base64

client = OpenAI()

def makeimg(prompt):
    imgbot = client.images.generate(
        model="gpt-image-1",
        prompt=prompt,
        size="1024x1024",
        background="transparent",
        quality="low",
    )

    image_base64 = imgbot.data[0].b64_json
    image_bytes = base64.b64decode(image_base64)
    return StreamingResponse(io.BytesIO(image_bytes), media_type="image/png")