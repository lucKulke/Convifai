FROM python:3.11.4

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY main.py /app/
COPY ./handler /app/handler
COPY ./config /app/config
COPY ./img /app/img


EXPOSE 8000

CMD ["python", "main.py"]