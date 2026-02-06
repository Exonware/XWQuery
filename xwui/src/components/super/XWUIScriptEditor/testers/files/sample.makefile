# Makefile Example
# Comprehensive Makefile demonstrating various features

# Variables
CC = gcc
CFLAGS = -Wall -Wextra -std=c11 -O2
LDFLAGS = -lm
SRCDIR = src
OBJDIR = obj
BINDIR = bin
TARGET = $(BINDIR)/app

# Source files
SOURCES = $(wildcard $(SRCDIR)/*.c)
OBJECTS = $(SOURCES:$(SRCDIR)/%.c=$(OBJDIR)/%.o)
HEADERS = $(wildcard $(SRCDIR)/*.h)

# Default target
all: $(TARGET)

# Create target executable
$(TARGET): $(OBJECTS) | $(BINDIR)
	$(CC) $(OBJECTS) -o $@ $(LDFLAGS)
	@echo "Build complete: $@"

# Compile source files to object files
$(OBJDIR)/%.o: $(SRCDIR)/%.c $(HEADERS) | $(OBJDIR)
	$(CC) $(CFLAGS) -c $< -o $@

# Create directories
$(OBJDIR):
	mkdir -p $(OBJDIR)

$(BINDIR):
	mkdir -p $(BINDIR)

# Clean build artifacts
clean:
	rm -rf $(OBJDIR) $(BINDIR)
	@echo "Clean complete"

# Install target
install: $(TARGET)
	cp $(TARGET) /usr/local/bin/
	@echo "Installation complete"

# Uninstall target
uninstall:
	rm -f /usr/local/bin/$(notdir $(TARGET))
	@echo "Uninstallation complete"

# Run target
run: $(TARGET)
	./$(TARGET)

# Debug build
debug: CFLAGS += -g -DDEBUG
debug: $(TARGET)

# Release build
release: CFLAGS += -DNDEBUG
release: clean $(TARGET)

# Test target
test: $(TARGET)
	./$(TARGET) --test

# Help target
help:
	@echo "Available targets:"
	@echo "  all       - Build the application (default)"
	@echo "  clean     - Remove build artifacts"
	@echo "  install   - Install the application"
	@echo "  uninstall - Uninstall the application"
	@echo "  run       - Build and run the application"
	@echo "  debug     - Build with debug symbols"
	@echo "  release   - Build release version"
	@echo "  test      - Run tests"
	@echo "  help      - Show this help message"

# Phony targets
.PHONY: all clean install uninstall run debug release test help

