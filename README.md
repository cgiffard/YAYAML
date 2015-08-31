# YAYAML

Yet Another Yet Another Markup Language

## Installation

`npm install yayaml`

## Testing

`npm test`

## What the hell?

YAYAML is a very light spin on YAML, designed to create a visually unopinionated
configuration language.

### Example

    node api-service-http-frontend
        title   API Server HTTP Frontend 02
        region  ap-southeast2
        region  api
        region  HTTP Frontend
        type    web
        owner   John Smith <john.smith@example.com>
        tag     UAT
        tag     API
        tag     HTTP
        tag     web
        tag     smithj
        depends api-service-cache
        depends api-service-elasticsearch
        depends ops-dmz-proxy
        
        metric messages_received
            weight  1
            top
                acceptable  500
                critical    1000
            bottom
                acceptable  25
                critical    5

# Licence

Copyright (c) 2015, Christopher Giffard <christopher.giffard@cgiffard.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.