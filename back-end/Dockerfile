FROM python:3.11.7-bookworm

WORKDIR /app

COPY ./requirements.txt /app/
COPY ./main.py /app/
COPY ./handler /app/
COPY ./config /app/


RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "main.py", "--host=0.0.0.0"]