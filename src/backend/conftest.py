import pytest

"""
configure anyio to use asyncio as the backend
otherwise there with be a error saying trio is not installed
"""


@pytest.fixture
def anyio_backend():
    return "asyncio"
